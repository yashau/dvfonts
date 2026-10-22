"""Recover a legacy (ASCII-slot) Thaana font's keyboard layout by matching its glyph
outlines against a Unicode twin of the same design.

Glyphs are rasterised on a baseline-anchored em canvas (so marks above vs below the
line stay distinct), left-aligned on ink, then compared by blurred correlation."""

import sys
from pathlib import Path

import freetype
import numpy as np

ROOT = Path(__file__).resolve().parents[2]  # fonts/
PX = 64  # em size in pixels
CAN = (int(PX * 2.0), int(PX * 2.4))  # (h, w)
BASE = int(PX * 1.3)  # baseline row in canvas


def raster(face, cp):
    if not face.get_char_index(cp):
        return None
    face.load_char(cp, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
    g = face.glyph
    bm = g.bitmap
    if bm.width == 0 or bm.rows == 0:
        return None
    a = np.array(bm.buffer, dtype=np.float32).reshape(bm.rows, bm.pitch)[:, : bm.width] / 255
    c = np.zeros(CAN, np.float32)
    top = BASE - g.bitmap_top
    h, w = a.shape
    y0, y1 = max(top, 0), min(top + h, CAN[0])
    x1 = min(w, CAN[1])
    if y1 <= y0:
        return None
    c[y0:y1, :x1] = a[y0 - top : y1 - top, :x1]
    return blur(c)


def blur(a, r=2):
    k = np.ones(2 * r + 1) / (2 * r + 1)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, "same"), 0, a)
    return np.apply_along_axis(lambda v: np.convolve(v, k, "same"), 1, a)


def score(a, b):
    a = a - a.mean()
    b = b - b.mean()
    d = np.sqrt((a * a).sum() * (b * b).sum())
    return float((a * b).sum() / d) if d else 0


def face(path):
    f = freetype.Face(str(ROOT / "sources" / path))
    f.set_pixel_sizes(PX, PX)
    return f


TARGETS = list(range(0x0780, 0x07B2)) + [0x060C, 0x061B, 0x061F, 0xFDF2, 0x00F7, 0x00D7]


def match(legacy, twin, chars=None):
    L, U = face(legacy), face(twin)
    T = {cp: r for cp in TARGETS if (r := raster(U, cp)) is not None}
    res = {}
    for c in chars or range(33, 127):
        r = raster(L, c)
        if r is None:
            continue
        res[chr(c)] = sorted(((score(r, t), cp) for cp, t in T.items()), reverse=True)[:3]
    return res


if __name__ == "__main__":
    for ch, best in match(sys.argv[1], sys.argv[2]).items():
        (s1, c1), (s2, c2), _ = best
        flag = "" if s1 > 0.6 and s1 - s2 > 0.08 else "  ??"
        print(f"{ch!r} -> U+{c1:04X} {chr(c1)} {s1:.2f}   (2nd U+{c2:04X} {chr(c2)} {s2:.2f}){flag}")
