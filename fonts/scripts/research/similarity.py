"""Find near-duplicate designs: compare rasterised Thaana letters across all fonts."""

import json
import sys
from pathlib import Path

import freetype
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))  # fonts/scripts
from legacy import unicode_to_ascii

ROOT = Path(__file__).resolve().parents[2]  # fonts/
N = 40
LETTERS = "ހށނރބޅކއވމފދތލގޏސޑޒޓޔޕޖޗޘޙޚޛޜޝޞޟޠޡޢޣޤޥ"


def vec(path, fname):
    f = freetype.Face(str(path))
    f.set_pixel_sizes(96, 96)
    inv = unicode_to_ascii(fname) or {}
    out = []
    for ch in LETTERS:
        cp = ord(inv.get(ch, ch))
        if not f.get_char_index(cp):
            out.append(None)
            continue
        f.load_char(cp, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
        bm = f.glyph.bitmap
        if not bm.width or not bm.rows:
            out.append(None)
            continue
        a = np.array(bm.buffer, np.float32).reshape(bm.rows, bm.pitch)[:, : bm.width] / 255
        h, w = a.shape
        s = max(h, w)
        p = np.zeros((s, s), np.float32)
        p[(s - h) // 2 : (s - h) // 2 + h, (s - w) // 2 : (s - w) // 2 + w] = a
        idx = (np.arange(N) * s / N).astype(int)
        v = p[np.ix_(idx, idx)].ravel()
        v = v - v.mean()
        n = np.linalg.norm(v)
        out.append(v / n if n else None)
    return out


audit = {r["file"]: r for r in json.load(open(ROOT / "build/audit.json"))}
names = [f for f in sorted(audit) if audit[f]["thaana"] > 0 or unicode_to_ascii(f)]
V = {f: vec(ROOT / "sources" / f, f) for f in names}
pairs = []
for i, a in enumerate(names):
    for b in names[i + 1 :]:
        s = [float(x @ y) for x, y in zip(V[a], V[b]) if x is not None and y is not None]
        if len(s) >= 30:
            pairs.append((np.mean(s), a, b))
pairs.sort(reverse=True)
json.dump([(float(s), a, b) for s, a, b in pairs if s > 0.85], open(ROOT / "build/similar.json", "w"), indent=0)
for s, a, b in pairs:
    if s < 0.9:
        break
    print(f"{s:.3f}  {a:32} {b}")
