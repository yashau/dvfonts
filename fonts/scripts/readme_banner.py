"""Render the README title as SVG with text converted to outlines.

GitHub can't load web fonts in README images, so the Thaana is shaped with
HarfBuzz and every glyph is emitted as a path. Writes light and dark variants
to .github/assets/ (picked by <picture> + prefers-color-scheme in README.md).

    uv run python scripts/readme_banner.py
"""

from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent  # fonts/
OUT = ROOT.parent / ".github" / "assets"
FONT = ROOT / "sources" / "bolhu-bold.ttf"
LATIN_FONT = ROOT / "sources" / "bolhu-bold.ttf"


def shape(path: Path, text: str, rtl: bool) -> tuple[list[tuple[str, float, float]], float, TTFont]:
    """Glyph names with pen positions (font units) and total advance."""
    data = path.read_bytes()
    face = hb.Face(data)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    if rtl:
        buf.direction, buf.script, buf.language = "rtl", "Thaa", "dv"
    hb.shape(font, buf)
    tt = TTFont(path)
    order = tt.getGlyphOrder()
    x = 0.0
    placed = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions, strict=True):
        placed.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
        x += pos.x_advance
    return placed, x, tt


def path_for(tt: TTFont, placed, scale: float, ox: float, baseline: float) -> str:
    gs = tt.getGlyphSet()
    pen = SVGPathPen(gs)
    for name, gx, gy in placed:
        # Font units are y-up; SVG is y-down.
        t = TransformPen(pen, (scale, 0, 0, -scale, ox + gx * scale, baseline - gy * scale))
        gs[name].draw(t)
    return pen.getCommands()


def banner(fg: str, accent: str) -> str:
    latin, lw, ltt = shape(LATIN_FONT, "dvfonts", rtl=False)
    thaana, tw, ttt = shape(FONT, "ޑީވީފޮންޓްސް", rtl=True)
    lupm, tupm = ltt["head"].unitsPerEm, ttt["head"].unitsPerEm
    w = 1200
    ls, ts = 120 / lupm, 74 / tupm
    lx, tx = (w - lw * ls) / 2, (w - tw * ts) / 2
    label = "dvfonts — ޑީވީފޮންޓްސް"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} 300" width="{w}" height="300"
  role="img" aria-label="{label}">
  <path fill="{fg}" d="{path_for(ltt, latin, ls, lx, 150)}"/>
  <path fill="{accent}" d="{path_for(ttt, thaana, ts, tx, 262)}"/>
</svg>
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "banner-light.svg").write_text(banner("#0b0d12", "#0e7c66"))
    (OUT / "banner-dark.svg").write_text(banner("#f5f7fa", "#3ecfa9"))
    print(f"wrote {OUT / 'banner-light.svg'} and banner-dark.svg")


if __name__ == "__main__":
    main()
