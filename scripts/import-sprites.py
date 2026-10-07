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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = json.load(open(os.path.join(ROOT, 'docs/image_manifest.json')))
BY_KEY = {a['key']: a for a in MANIFEST['assets'] + MANIFEST['optionalNewAssets']}
MAX_SIDE = {'character': 640, 'level_icon': 512, 'item': 512, 'item_effect_glow': 512, 'scene_sprite': 640, 'ui_art': 1100, 'effect': 512, 'optional_new': 640}
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from spritelib import already_transparent, bbox, key_image  # noqa: E402

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
            raw = Image.open(f)
            imgs[k] = raw.convert('RGBA') if already_transparent(raw) else key_image(raw, BY_KEY[k]['background'])
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
        b = fam_box.get(e.get('scaleFamily')) if (e['category'] == 'character' and e.get('scaleFamily')) else boxes[k]
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
