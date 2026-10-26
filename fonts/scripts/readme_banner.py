"""Render the fonts.mv wordmark with text converted to outlines.

The Thaana is shaped with HarfBuzz (Bolhu Bold) and every glyph is emitted as a
path, so it renders identically everywhere without loading a font. Writes:

  .github/assets/banner-{light,dark}.svg      README title (stacked)
  apps/web/src/lib/components/logo.svelte     site header (one line, follows the theme)
  apps/web/src/lib/assets/favicon.svg         favicon (tan on dark brown, for both themes)
  apps/web/static/apple-touch-icon.png        home-screen icon, 180x180
  apps/web/static/og.png                      link preview (Open Graph), 1200x630

    uv run python scripts/readme_banner.py
"""

from pathlib import Path

import pathops
import resvg_py
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.roundingPen import RoundingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent  # fonts/
OUT = ROOT.parent / ".github" / "assets"
# The Thaana half of the wordmark: MV Golhifoshi by Zillon (CC BY-SA 3.0), credited in the README.
THAANA_FONT = ROOT / "sources" / "mv-golhifoshi.otf"
TAGLINE_FONT = ROOT / "sources" / "bolhu-regular.ttf"
TAGLINE = "Open Dhivehi fonts for the web"
# The wordmark is the domain in Thaana; LATIN is its accessible name.
LATIN = "fonts.mv"
THAANA = "ފޮންޓްސް.އެމްވީ"
FAVICON = "ފ"  # faafu, the Thaana f, in MV Golhifoshi


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


def ink(tt: TTFont, placed) -> tuple[float, float, float, float]:
    """Ink bounds (font units) of shaped glyphs."""
    gs = tt.getGlyphSet()
    pen = BoundsPen(gs)
    for name, gx, gy in placed:
        gs[name].draw(TransformPen(pen, (1, 0, 0, 1, gx, gy)))
    return pen.bounds


def thaana_mark(height: float, cx: float, top: float) -> tuple[str, float, float]:
    """The wordmark (the Thaana alone), its ink `height` tall, centred on `cx`, ink starting at `top`.
    Returns the path, the ink's width and its bottom edge."""
    glyphs, _, tt = shape(THAANA_FONT, THAANA, rtl=True)
    x0, y0, x1, y1 = ink(tt, glyphs)
    scale = height / (y1 - y0)
    d = path_for(tt, glyphs, scale, cx - (x0 + x1) / 2 * scale, top + y1 * scale)
    return d, (x1 - x0) * scale, top + height


def banner(accent: str) -> str:
    w, h = 1200, 300
    d, _, _ = thaana_mark(200, w / 2, 50)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"
  role="img" aria-label="{LATIN} — {THAANA}">
  <path fill="{accent}" d="{d}"/>
</svg>
"""


# MV Golhifoshi is a pixel font: every line is one cell of this grid (882/15 font units) thick.
GRID = 882 / 15


def filled_shapes(glyphs, gs, x0: float, h: int) -> str:
    """The outer outline of every glyph shape with its holes closed, in the header logo's
    grid cells: the solid shapes that the font's lines frame."""
    solid = pathops.Path()
    for name, gx, gy in glyphs:
        glyph = pathops.Path()
        t = (1 / GRID, 0, 0, -1 / GRID, (gx - x0) / GRID, h - gy / GRID)
        gs[name].draw(TransformPen(RoundingPen(glyph.getPen()), t))
        glyph.simplify()
        contours = list(glyph.contours)
        boxes = [c.bounds for c in contours]

        def inside(a, b):
            return a != b and b[0] <= a[0] and b[1] <= a[1] and a[2] <= b[2] and a[3] <= b[3]

        for c, box in zip(contours, boxes, strict=True):
            if not any(inside(box, other) for other in boxes):
                outer = pathops.Path()
                c.draw(outer.getPen())
                solid = pathops.op(solid, outer, pathops.PathOp.UNION)
    pen = SVGPathPen(None)
    solid.draw(pen)
    return pen.getCommands()


def header_logo() -> str:
    """Wordmark for the site header; the colour comes from CSS. Drawn in grid cells, every
    corner snapped to a whole cell, so at one cell per CSS pixel the lines are pixel-sharp
    (the component sets the height to match). The SVG box runs from the top of the ink down to
    the Thaana baseline; the fili below hang outside it (overflow: visible), like descenders."""
    glyphs, _, tt = shape(THAANA_FONT, THAANA, rtl=True)
    x0, _, x1, y1 = ink(tt, glyphs)
    h = round(y1 / GRID)  # baseline (y = 0) to the top of the ink, in cells
    width = round((x1 - x0) / GRID)
    gs = tt.getGlyphSet()
    pen = SVGPathPen(gs)
    snap = RoundingPen(pen)
    for name, gx, gy in glyphs:
        # Font units are y-up; SVG is y-down.
        t = (1 / GRID, 0, 0, -1 / GRID, (gx - x0) / GRID, h - gy / GRID)
        gs[name].draw(TransformPen(snap, t))
    return f"""<!-- Generated by fonts/scripts/readme_banner.py: the {LATIN} wordmark as outlines. -->
<script lang="ts">
	// {h} cells tall: render at {h}px (one cell per pixel) so the lines stay sharp.
	let {{ class: className = '' }}: {{ class?: string }} = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {h}"
	width="{width}"
	height="{h}"
	overflow="visible"
	shape-rendering="crispEdges"
	class={{className}}
	role="img"
	aria-label="{LATIN} — {THAANA}"
>
	<!-- Letters and fili filled with the dark theme's brown under the tan lines (same on both themes). -->
	<path class="fill-brand-ground" d="{filled_shapes(glyphs, gs, x0, h)}" />
	<path class="fill-brand" d="{pen.getCommands()}" />
</svg>
"""


def favicon(bg: str, fg: str) -> str:
    """FAVICON on a 16x16 tile, drawn on MV Golhifoshi's grid: one cell per pixel, so it's
    pixel-sharp at 16px and exactly doubled at 32px. The glyph is 15 cells square, so the one
    spare pixel goes to the top and left."""
    glyphs, _, tt = shape(THAANA_FONT, FAVICON, rtl=True)
    x0, _, _, y1 = ink(tt, glyphs)
    gs = tt.getGlyphSet()
    pen = SVGPathPen(gs)
    snap = RoundingPen(pen)
    for name, gx, gy in glyphs:
        gs[name].draw(TransformPen(snap, (1 / GRID, 0, 0, -1 / GRID, 1 + (gx - x0) / GRID, 1 + (y1 - gy) / GRID)))
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
  <rect width="16" height="16" rx="1" fill="{bg}"/>
  <path fill="{fg}" shape-rendering="crispEdges" d="{pen.getCommands()}"/>
</svg>
"""


def og_card() -> str:
    """Link-preview card (Open Graph): the wordmark and tagline, centred, in the dark theme's browns."""
    w, h = 1200, 630
    d, _, bottom = thaana_mark(220, w / 2, 160)
    glyphs, adv, tt = shape(TAGLINE_FONT, TAGLINE, rtl=False)
    scale = 44 / tt["head"].unitsPerEm
    tagline_d = path_for(tt, glyphs, scale, (w - adv * scale) / 2, bottom + 100)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="{w}" height="{h}" fill="#130d09"/>
  <path fill="#cbab88" d="{d}"/>
  <path fill="#a49589" d="{tagline_d}"/>
</svg>
"""


def main() -> None:
    web = ROOT.parent / "apps" / "web" / "src" / "lib"
    (web / "components" / "logo.svelte").write_text(header_logo())
    (web / "assets" / "favicon-dark.svg").unlink(missing_ok=True)  # earlier theme-specific favicons
    (web / "assets" / "favicon-light.svg").unlink(missing_ok=True)
    (web / "assets" / "favicon.svg").write_text(favicon("#130d09", "#cbab88"))
    (web.parent.parent / "static" / "apple-touch-icon.png").write_bytes(
        bytes(resvg_py.svg_to_bytes(svg_string=favicon("#130d09", "#cbab88"), width=180, height=180))
    )
    # Telegram, WhatsApp and most link previews need a raster image, not SVG.
    (web.parent.parent / "static" / "og.png").write_bytes(bytes(resvg_py.svg_to_bytes(svg_string=og_card())))
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "banner-light.svg").write_text(banner("#462c19"))
    (OUT / "banner-dark.svg").write_text(banner("#cbab88"))
    print(f"wrote {OUT / 'banner-light.svg'} and banner-dark.svg")


if __name__ == "__main__":
    main()
