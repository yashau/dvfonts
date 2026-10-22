# Research tools

One-off scripts used while building the catalogue. Not part of the build, kept
because they document how decisions were made and are useful when adding fonts.

| Script                                                  | What it does                                                                                                                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `audit.py`                                              | Dumps names, metrics, coverage and health checks for every file in `sources/` to `build/audit.json`.                                                                                        |
| `detect_layout.py`                                      | Classifies legacy ASCII-slot fonts as typewriter or phonetic layout from where `a`/`w` sit.                                                                                                 |
| `match_layout.py`, `combo_match.py`, `exact_match*.py`  | Recover a legacy font's keyboard layout by matching its glyph outlines against a Unicode twin of the same design (how the A_ "typewriter" layout was derived from A_Waheed vs MV A Waheed). |
| `similarity.py`                                         | Finds duplicate designs across the collection by comparing rasterised letters (legacy fonts through their layout).                                                                          |
| `legacy_sheet.py`, `glyph_grid.py`, `specimen_sheet.py` | HTML contact sheets for eyeballing layouts, glyphs and specimens; screenshot with `shot.sh`.                                                                                                |
| `pangram_check.py`                                      | Reports which Thaana letters and fili a candidate pangram is missing.                                                                                                                       |

Run from `fonts/` with `uv run python scripts/research/<script>.py`. Output goes to `fonts/build/` (git-ignored).
