"""Legacy (pre-Unicode) Thaana keyboard layouts: ASCII char -> Unicode char.

Single source of truth is packages/thaana/src/legacy-layouts.json, shared with
the JS legacy-text converter (@dvfonts/thaana convertLegacy).

typewriter: the "A_" font layout. Recovered by matching A_Waheed's outlines
            against MV A Waheed (scripts/combo_match.py) and checked visually.
phonetic:   Divehi Phonetic style layout used by a few legacy fonts.
"""

import json
from pathlib import Path

_LAYOUTS = json.loads((Path(__file__).resolve().parents[2] / "packages/thaana/src/legacy-layouts.json").read_text())
TYPEWRITER: dict[str, str] = _LAYOUTS["typewriter"]
PHONETIC: dict[str, str] = _LAYOUTS["phonetic"]
LAYOUTS = {"typewriter": TYPEWRITER, "phonetic": PHONETIC}
