"""Shared helpers for the sprite scripts (background keying)."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HEX = {'#00FF00': (0, 255, 0), '#FF00FF': (255, 0, 255)}


def smooth(x, lo, hi):
    t = np.clip((x - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def key_chroma(rgb, bg_hex):
    """Remove a flat chroma background by flood-fill from the border (same-coloured pixels inside the subject survive)."""
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
    # background seen through holes (inside a ring, between handles) is not connected to the border: remove it too
    inner, k = ndi.label((dist < 55) & ~region)
    if k:
        sizes = ndi.sum(np.ones_like(inner), inner, range(1, k + 1))
        for idx, size in enumerate(sizes, start=1):
            if size >= 25:
                region |= inner == idx
    alpha = np.where(region, 0.0, 1.0)
    band = ndi.binary_dilation(region, iterations=3) & ~region
    alpha[band] = smooth(dist[band], 70, 150)
    near = ndi.binary_dilation(region, iterations=24) & ~region
    r_, g_, b_ = f[..., 0], f[..., 1], f[..., 2]
    if bg_hex == '#00FF00':   # leftover bright key-coloured haze next to the background (generators tint glows green)
        alpha[near & (g_ > 180) & (g_ > r_ + 60) & (g_ > b_ + 60)] = 0
    else:
        alpha[near & (r_ > 180) & (b_ > 180) & (g_ < r_ - 60)] = 0
    spill = ndi.binary_dilation(region, iterations=8) & ~region
    out = f.copy()
    # de-spill: pull the key colour out of pixels next to the removed background
    if bg_hex == '#00FF00':
        out[..., 1] = np.where(spill, np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2])), out[..., 1])
    else:
        m = np.where(spill, np.minimum(np.minimum(out[..., 0], out[..., 2]), out[..., 1] + 40), 0)
        out[..., 0] = np.where(spill, np.minimum(out[..., 0], np.maximum(out[..., 1], m)), out[..., 0])
        out[..., 2] = np.where(spill, np.minimum(out[..., 2], np.maximum(out[..., 1], m)), out[..., 2])
    return out.clip(0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)


def key_black(rgb):
    """Glow sprites drawn on black: luminance becomes alpha."""
    f = rgb.astype(np.float32) / 255
    a = f.max(axis=2)
    a = np.clip((a - 0.04) * 1.15, 0, 1)
    out = np.where(a[..., None] > 0.01, f / np.maximum(a[..., None], 0.01), 0)
    return (out.clip(0, 1) * 255).astype(np.uint8), (a * 255).astype(np.uint8)


def key_image(im, bg_hex):
    rgb = np.array(im.convert('RGB'))
    rgb, alpha = key_black(rgb) if bg_hex == '#000000' else key_chroma(rgb, bg_hex)
    return Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')


def already_transparent(im):
    """True when the file already carries real transparency (e.g. produced by split-sheet.py)."""
    if im.mode != 'RGBA':
        return False
    a = np.array(im.getchannel('A'))
    return (a < 10).mean() > 0.15


def bbox(im, thr=10):
    return im.getchannel('A').point(lambda v: 255 if v > thr else 0).getbbox()
