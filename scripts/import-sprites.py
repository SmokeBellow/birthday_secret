#!/usr/bin/env python3
"""Import newly generated sprites into public/assets/v2/.

usage: python3 scripts/import-sprites.py <folder with <key>.png|jpg|webp> [--dry]

* the file name (without extension) is the semantic asset key from docs/image_manifest.json;
* the flat background colour named in the manifest (#00FF00 / #FF00FF / #000000) is removed:
  chroma colours by flood-fill from the border (interior pixels of the same colour survive) with a soft edge
  and colour de-spill; black glows are converted by luminance;
* characters of one family (hero_*, player2_*, lapka_*) are cropped with ONE shared box so their relative
  scale is preserved; every other sprite is cropped to its own box;
* results are downscaled to the in-game working size and written to the path from the manifest.
"""
import glob, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = json.load(open(os.path.join(ROOT, 'docs/image_manifest.json')))
BY_KEY = {a['key']: a for a in MANIFEST['assets'] + MANIFEST['optionalNewAssets']}
MAX_SIDE = {'character': 640, 'level_icon': 512, 'item': 512, 'item_effect_glow': 512, 'scene_sprite': 640, 'ui_art': 1100, 'effect': 512, 'optional_new': 640}
HEX = {'#00FF00': (0, 255, 0), '#FF00FF': (255, 0, 255)}

def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)

def key_chroma(rgb, bg_hex):
    h, w, _ = rgb.shape
    f = rgb.astype(np.float32)
    ref = np.array(HEX[bg_hex], np.float32)
    border = np.concatenate([f[0], f[-1], f[:, 0], f[:, -1]])
    est = np.median(border, axis=0)                      # actual background colour (generators drift a little)
    if np.linalg.norm(est - ref) < 90:
        ref = est
    dist = np.linalg.norm(f - ref, axis=2)
    lab, _ = ndi.label(dist < 70)
    edge_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    region = np.isin(lab, edge_labels[edge_labels > 0])
    alpha = np.where(region, 0.0, 1.0)
    band = ndi.binary_dilation(region, iterations=3) & ~region
    alpha[band] = smooth(dist[band], 70, 150)
    out = f.copy()
    # de-spill: pull the key colour out of semi-transparent edge pixels
    edge = band & (alpha < 1.0)
    if bg_hex == '#00FF00':
        out[..., 1] = np.where(edge | band, np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2])), out[..., 1])
    else:
        m = np.where(edge | band, np.minimum(np.minimum(out[..., 0], out[..., 2]), out[..., 1] + 40), 0)
        out[..., 0] = np.where(edge | band, np.minimum(out[..., 0], np.maximum(out[..., 1], m)), out[..., 0])
        out[..., 2] = np.where(edge | band, np.minimum(out[..., 2], np.maximum(out[..., 1], m)), out[..., 2])
    return out.clip(0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)

def key_black(rgb):
    f = rgb.astype(np.float32) / 255
    a = f.max(axis=2)
    a = np.clip((a - 0.04) * 1.15, 0, 1)
    out = np.where(a[..., None] > 0.01, f / np.maximum(a[..., None], 0.01), 0)
    return (out.clip(0, 1) * 255).astype(np.uint8), (a * 255).astype(np.uint8)

def process(path, entry):
    im = Image.open(path).convert('RGB')
    rgb = np.array(im)
    rgb, alpha = key_black(rgb) if entry['background'] == '#000000' else key_chroma(rgb, entry['background'])
    return Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')

def bbox(im):
    return im.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()

def main():
    src = sys.argv[1]
    dry = '--dry' in sys.argv
    files = {}
    for f in glob.glob(os.path.join(src, '**', '*'), recursive=True):
        stem, ext = os.path.splitext(os.path.basename(f))
        if ext.lower() in ('.png', '.jpg', '.jpeg', '.webp'):
            files[stem] = f
    unknown = [k for k in files if k not in BY_KEY]
    imgs, boxes = {}, {}
    for k, f in files.items():
        if k in BY_KEY:
            imgs[k] = process(f, BY_KEY[k])
            boxes[k] = bbox(imgs[k])
            if not boxes[k]:
                print('WARN empty after keying:', k)
    fam_box = {}
    for k, b in boxes.items():
        fam = BY_KEY[k].get('scaleFamily')
        if fam and b:
            x0, y0, x1, y1 = fam_box.get(fam, (10**9, 10**9, 0, 0))
            fam_box[fam] = (min(x0, b[0]), min(y0, b[1]), max(x1, b[2]), max(y1, b[3]))
    done = 0
    for k, im in imgs.items():
        e = BY_KEY[k]
        b = fam_box.get(e.get('scaleFamily')) if e['category'] == 'character' else boxes[k]
        if not b:
            continue
        pad = max(4, int(0.02 * max(b[2] - b[0], b[3] - b[1])))
        b = (max(0, b[0] - pad), max(0, b[1] - pad), min(im.width, b[2] + pad), min(im.height, b[3] + pad))
        out = im.crop(b)
        s = MAX_SIDE[e['category']] / max(out.size)
        if s < 1:
            out = out.resize((round(out.width * s), round(out.height * s)), Image.LANCZOS)
        dst = os.path.join(ROOT, e['file'])
        if not dry:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            out.save(dst, optimize=True)
        done += 1
        print(('would write ' if dry else 'wrote ') + e['file'], out.size)
    missing = [k for k in BY_KEY if k not in files and BY_KEY[k]['category'] != 'optional_new']
    print(f'\nimported {done}; not supplied yet: {len(missing)}; unknown file names: {unknown}')

main()
