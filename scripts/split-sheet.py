#!/usr/bin/env python3
"""Cut a generated sprite sheet into separate sprites named by asset key.

usage: python3 scripts/split-sheet.py <sheet id from docs/image_manifest.json> <sheet image> [--out new_sprites] [--gap N]

* the flat background (green / magenta / black) is removed with the same keying as import-sprites.py;
* every separate subject on the sheet is found as one blob (--gap = how far apart parts may be and still count
  as one subject; the script tries several values until the blob count matches the sheet definition);
* blobs are ordered left to right, top to bottom and named from the manifest order;
* all sprites of a sheet get the SAME canvas (so scale and baseline of a character family are preserved);
  characters are bottom-aligned, everything else centred;
* output: transparent PNGs in --out, ready for `python3 scripts/import-sprites.py <out>`.
"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from spritelib import key_image  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = json.load(open(os.path.join(ROOT, 'docs/image_manifest.json')))


def find_blobs(alpha, gap, min_area):
    mask = alpha > 40
    lab, n = ndi.label(ndi.binary_dilation(mask, structure=np.ones((3, 3)), iterations=gap))
    blobs = []
    for i, sl in enumerate(ndi.find_objects(lab), start=1):
        area = int(((lab[sl] == i) & mask[sl]).sum())
        if area >= min_area:
            blobs.append(dict(label=i, sl=sl, area=area, cy=(sl[0].start + sl[0].stop) / 2, cx=(sl[1].start + sl[1].stop) / 2, h=sl[0].stop - sl[0].start))
    return lab, blobs


def reading_order(blobs):
    if not blobs:
        return blobs
    med_h = float(np.median([b['h'] for b in blobs]))
    rows, cur = [], []
    for b in sorted(blobs, key=lambda b: b['cy']):
        if cur and abs(b['cy'] - np.mean([x['cy'] for x in cur])) > 0.6 * med_h:
            rows.append(cur)
            cur = []
        cur.append(b)
    rows.append(cur)
    return [b for r in rows for b in sorted(r, key=lambda b: b['cx'])]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    out = 'new_sprites'
    gap = None
    argv = sys.argv[1:]
    for i, a in enumerate(argv):
        if a == '--out':
            out = argv[i + 1]
            args.remove(out)
        if a == '--gap':
            gap = int(argv[i + 1])
            args.remove(argv[i + 1])
    sheet_id, path = args[0], args[1]
    sh = next((s for s in MANIFEST['sheets'] if s['id'] == sheet_id), None)
    if not sh:
        sys.exit('unknown sheet id. Known: ' + ', '.join(s['id'] for s in MANIFEST['sheets']))
    keys = sh['keys']

    img = key_image(Image.open(path), sh['background'])
    alpha = np.array(img.getchannel('A'))
    min_area = max(200, int(alpha.size * 0.0015))
    tries = [gap] if gap else [6, 10, 14, 20, 28, 40, 3]
    lab = blobs = None
    for g in tries:
        lab, blobs = find_blobs(alpha, g, min_area)
        if len(blobs) == len(keys):
            break
    if len(blobs) != len(keys):
        print(f'Found {len(blobs)} subjects, expected {len(keys)} ({", ".join(keys)}).')
        for b in reading_order(blobs):
            print(f"  blob at x={int(b['cx'])} y={int(b['cy'])} h={b['h']} area={b['area']}")
        sys.exit('Try --gap N (bigger merges parts of one subject, smaller separates touching subjects), or ask GPT for wider gaps.')

    ordered = reading_order(blobs)
    rgba = np.array(img)
    crops = []
    for b in ordered:
        sl = b['sl']
        m = ndi.binary_dilation(lab == b['label'], iterations=4)  # keep the soft edge, drop neighbours
        piece = rgba.copy()
        piece[..., 3] = np.where(m, piece[..., 3], 0)
        ys, xs = np.where(piece[..., 3] > 10)
        crops.append(Image.fromarray(piece[ys.min():ys.max() + 1, xs.min():xs.max() + 1]))
    pad = 24
    W = max(c.width for c in crops) + 2 * pad
    H = max(c.height for c in crops) + 2 * pad
    os.makedirs(out, exist_ok=True)
    for key, c in zip(keys, crops):
        canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        x = (W - c.width) // 2
        y = H - pad - c.height if sh['align'] == 'bottom' else (H - c.height) // 2
        canvas.paste(c, (x, y), c)
        canvas.save(os.path.join(out, key + '.png'), optimize=True)
        print('wrote', os.path.join(out, key + '.png'), c.size)
    print(f'\n{len(keys)} sprites, canvas {W}x{H}. Next: python3 scripts/import-sprites.py {out}')


main()
