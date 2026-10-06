#!/usr/bin/env python3
"""Normalise the handoff sprites.  usage: python3 scripts/clean-sprites.py <original public/assets/v2 dir>

The handoff PNGs are tiny sprites floating on a big transparent canvas; character sheets also carry
stray frame lines and a neighbouring item tile.  Starting from the ORIGINAL pack this script:
  * trims every sprite in items_rewards / level_icons / effects / scene_assets to its alpha bbox;
  * characters: drops line artefacts and item tiles, keeps the figure (left-most non-tile blob) and trims;
  * lapka_purr / lapka_stays / lapka_final hold a lantern tile instead of a clean cat in the pack,
    so they fall back to lapka_default's cat until the original art is supplied.
"""
import glob, os, shutil, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = sys.argv[1]
DST = 'public/assets/v2/'
A = 8

def bbox(im):
    return im.getchannel('A').point(lambda v: 255 if v > A else 0).getbbox()

def strip_lines(a):
    """Remove long thin frame-line blobs (generation artefacts) from an RGBA array, in place."""
    raw, _ = ndi.label(a[..., 3] > 40)
    for i, sl in enumerate(ndi.find_objects(raw), start=1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if min(w, h) <= 14 and max(w, h) >= 6 * min(w, h):
            a[..., 3][ndi.binary_dilation(raw == i, structure=np.ones((5, 5)))] = 0

def tile_angle(alpha):
    """Rotation (degrees) that makes the opaque tile's outline an upright rectangle (several tiles ship slightly rotated)."""
    m = Image.fromarray(((alpha > 128) * 255).astype(np.uint8))
    best, best_fill = 0.0, 0.0
    for ang in list(np.arange(-14, 14.1, 1.0)):
        r = m.rotate(ang, resample=Image.BILINEAR, expand=True)
        b = r.getbbox()
        if not b:
            continue
        fill = (np.array(r) > 128).sum() / ((b[2] - b[0]) * (b[3] - b[1]))
        if fill > best_fill:
            best, best_fill = ang, fill
    for ang in np.arange(best - 1, best + 1.01, 0.25):
        r = m.rotate(ang, resample=Image.BILINEAR, expand=True)
        b = r.getbbox()
        fill = (np.array(r) > 128).sum() / ((b[2] - b[0]) * (b[3] - b[1]))
        if fill > best_fill:
            best, best_fill = ang, fill
    return best, best_fill


def clean_chess(a):
    """Chess piece sprites carry L-shaped frame bars and a stray neighbour: keep only the piece itself."""
    mask = a[..., 3] > A
    opened = ndi.binary_opening(mask, structure=np.ones((11, 11)))
    lab, n = ndi.label(opened)
    if n:
        sizes = ndi.sum(opened, lab, range(1, n + 1))
        piece = lab == (1 + int(np.argmax(sizes)))
        keep = ndi.binary_dilation(piece, structure=np.ones((3, 3)), iterations=4) & mask
        a[..., 3] = np.where(keep, a[..., 3], 0)
    return a


def trim(src, dst):
    a = np.array(Image.open(src).convert('RGBA'))
    name = os.path.basename(src)
    if name.startswith('chess_pawn') or name.startswith('chess_knight'):
        a = clean_chess(a)
    else:
        strip_lines(a)
    im = Image.fromarray(a)
    b = bbox(im)
    if b and (b[2] - b[0]) * (b[3] - b[1]) > 0:
        tile_fill = (a[..., 3] > 128).sum() / ((b[2] - b[0]) * (b[3] - b[1]))
        if tile_fill > 0.6:  # an opaque tile: straighten it, then drop its blurry rim
            ang, fill = tile_angle(a[..., 3])
            if abs(ang) > 1.0 and fill > 0.9:
                im = im.rotate(ang, resample=Image.BICUBIC, expand=True)
            b = bbox(im)
            inset = 3 if min(b[2] - b[0], b[3] - b[1]) > 50 else 2
            b = (b[0] + inset, b[1] + inset, b[2] - inset, b[3] - inset)
            im.crop(b).save(dst, optimize=True)
            return
    im.crop(b).save(dst, optimize=True) if b else im.save(dst)


def clean_character(src, dst, is_lapka):
    a = np.array(Image.open(src).convert('RGBA'))
    mask = a[..., 3] > A
    raw, rn = ndi.label(a[..., 3] > 40)  # drop long thin frame lines that float beside the figure
    for i, sl in enumerate(ndi.find_objects(raw), start=1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if min(w, h) <= 14 and max(w, h) >= 6 * min(w, h):
            mask &= ~ndi.binary_dilation(raw == i, structure=np.ones((5, 5)))
    base = mask
    if is_lapka:  # frame bars are thin: opening removes them, regrow the cat inside the original mask
        base = ndi.binary_dilation(ndi.binary_opening(mask, structure=np.ones((13, 13))), structure=np.ones((9, 9))) & mask
    lab, n = ndi.label(ndi.binary_dilation(base, structure=np.ones((5, 5))))
    comps = []
    for i in range(1, n + 1):
        ys, xs = np.where((lab == i) & base)
        if len(ys) < 40:
            continue
        w, h = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        if min(w, h) <= 8:
            continue
        fill = len(ys) / (w * h)
        comps.append(dict(i=i, x=xs.min(), area=len(ys), tile=fill > 0.93 and 0.8 < w / h < 1.25))
    figures = [c for c in comps if not c['tile']] or comps
    pick = max(figures, key=lambda c: c['area']) if is_lapka else min(figures, key=lambda c: c['x'])
    keep = ndi.binary_dilation(lab == pick['i'], structure=np.ones((3, 3))) & mask
    if 'player2_final' in src:  # a faint 2px frame line survives inside the glow: cut it off
        ys, xs = np.where(keep)
        keep[:, : xs.min() + 14] = False
    a[..., 3] = np.where(keep, a[..., 3], 0)
    out = Image.fromarray(a)
    out.crop(bbox(out)).save(dst, optimize=True)

if os.path.abspath(SRC) != os.path.abspath(DST):
    shutil.rmtree(DST, ignore_errors=True)
    shutil.copytree(SRC, DST)
for d in ['items_rewards', 'level_icons', 'effects', 'scene_assets', 'scene_ui_art']:
    for f in glob.glob(f'{SRC}/{d}/*.png'):
        trim(f, f'{DST}{d}/{os.path.basename(f)}')
for f in sorted(glob.glob(f'{SRC}/characters/*.png')):
    name = os.path.basename(f)
    # Lapka tile-style reactions (annoyed/reactive/suspicious) are opaque 78px portraits: keep as they are.
    if name in ('lapka_annoyed.png', 'lapka_reactive.png', 'lapka_suspicious.png'):
        trim(f, f'{DST}characters/{name}')
    else:
        clean_character(f, f'{DST}characters/{name}', name.startswith('lapka'))
for name in ['lapka_purr', 'lapka_stays', 'lapka_final']:
    shutil.copyfile(f'{DST}characters/lapka_default.png', f'{DST}characters/{name}.png')
