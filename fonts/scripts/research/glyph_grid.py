"""Render ASCII 0x21-0x7E of several fonts, labelled, for visual inspection."""

import html
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # fonts/
out = sys.argv[1]
fonts = sys.argv[2:]
chars = [chr(c) for c in range(33, 127)]
css = "".join(f"@font-face{{font-family:f{i};src:url('file://{ROOT}/sources/{f}')}}" for i, f in enumerate(fonts))
body = ""
for i, f in enumerate(fonts):
    cells = "".join(
        f"<div class=c><div class=g style='font-family:f{i}'>{html.escape(c)}</div><div class=k>{html.escape(c)}</div></div>"
        for c in chars
    )
    body += f"<div class=t>{f}</div><div class=w>{cells}</div>"
Path(out).write_text(f"""<html><meta charset=utf-8><style>{css}
body{{margin:4px;width:1880px}} .w{{display:flex;flex-wrap:wrap}} .t{{font:bold 14px sans-serif;margin-top:4px}}
.c{{width:58px;height:62px;border:1px solid #ddd;position:relative;overflow:hidden}}
.g{{font-size:36px;text-align:center;line-height:54px;white-space:pre}} .k{{position:absolute;top:0;left:2px;font:11px monospace;color:#c00}}</style>
<body>{body}</body></html>""")
