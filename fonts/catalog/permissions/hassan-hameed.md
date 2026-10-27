# Hassan Hameed's fonts

On 23 October 2026 Dr Hassan Hameed, the designer of these fonts, gave dvfonts permission to distribute them, on these conditions:

- The fonts are distributed in their original, unmodified form: no changes to the files, glyph designs, glyph mappings, character order or any other part of their internal structure.
- Converting the files to WOFF, WOFF2 and other formats is allowed.
- Nothing is charged for them.
- Ownership stays with him: he holds the rights to the Thaana glyphs. dvfonts does not claim authorship and does not sell, modify, adapt or repackage the fonts.

## How dvfonts follows them

- Every family below is marked `unmodified = true` in [`families.toml`](families.toml). The build copies the original files byte-for-byte and only adds WOFF and WOFF2 conversions of them. It does not repair metrics, rename, re-tag marks or subset these fonts.
- Where a font's line metrics would clip the fili in browsers, the site corrects it with CSS (`@font-face` `ascent-override` / `descent-override`), which leaves the font file untouched.
- His pre-Unicode A_ fonts are not remapped to Unicode, because that would change their glyph mappings. Their original files, byte for byte, are only in the legacy bundle (`/downloads/dvfonts-legacy.zip`), for opening old documents: they have no font pages and are not in the web font API or any other bundle. That bundle also carries the original A_ files of designs listed below in their Unicode versions.
- Every font page and download credits him and links to [hassanhameed.com](https://hassanhameed.com).
- dvfonts is free and non-profit, and its code is open source under the MIT license. The fonts keep their own terms.
- When he revises a font, the new file replaces the old one in `fonts/sources/` as published.

## The fonts

| Family                                                                      | Styles                      | Offered as                                                                        |
| --------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| A Kaani                                                                     | Bold                        | Legacy bundle only, for opening old documents (pre-Unicode, Thaana on Latin keys) |
| A Lakudi                                                                    | Regular                     | Legacy bundle only, for opening old documents (pre-Unicode, Thaana on Latin keys) |
| A Lakudi College                                                            | Regular                     | Legacy bundle only, for opening old documents (pre-Unicode, Thaana on Latin keys) |
| A Uni                                                                       | Bold                        | Legacy bundle only, for opening old documents (pre-Unicode, Thaana on Latin keys) |
| A Waheed College                                                            | Regular                     | Legacy bundle only, for opening old documents (pre-Unicode, Thaana on Latin keys) |
| [Bismi](https://dvfonts.yashau.com/fonts/bismi)                             | Regular                     | Download and web font; not on the browse page                                     |
| [MV A Waheed](https://dvfonts.yashau.com/fonts/mv-a-waheed)                 | Regular                     | Download and web font                                                             |
| [MV Aammu FK](https://dvfonts.yashau.com/fonts/mv-aammu-fk)                 | Bold                        | Download and web font                                                             |
| [MV Aka Light](https://dvfonts.yashau.com/fonts/mv-aka-light)               | Light                       | Download and web font                                                             |
| [MV Faseyha](https://dvfonts.yashau.com/fonts/mv-faseyha)                   | Regular, Bold               | Download and web font                                                             |
| [MV Faseyha Au](https://dvfonts.yashau.com/fonts/mv-faseyha-au)             | Regular                     | Download and web font                                                             |
| [MV Funa](https://dvfonts.yashau.com/fonts/mv-funa)                         | Light, Regular, Bold, Black | Download and web font                                                             |
| [MV Ilham](https://dvfonts.yashau.com/fonts/mv-ilham)                       | Regular, Bold               | Download and web font                                                             |
| [MV Kelaa](https://dvfonts.yashau.com/fonts/mv-kelaa)                       | Regular, Bold               | Download and web font                                                             |
| [MV Koagannu](https://dvfonts.yashau.com/fonts/mv-koagannu)                 | Bold                        | Download and web font                                                             |
| [MV Maliku](https://dvfonts.yashau.com/fonts/mv-maliku)                     | Regular                     | Download and web font                                                             |
| [MV Midhili](https://dvfonts.yashau.com/fonts/mv-midhili)                   | Bold                        | Download and web font                                                             |
| [MV Nasri](https://dvfonts.yashau.com/fonts/mv-nasri)                       | Regular, Bold               | Download and web font                                                             |
| [MV Open Condensed](https://dvfonts.yashau.com/fonts/mv-open-condensed)     | Bold                        | Download and web font                                                             |
| [MV Oswald](https://dvfonts.yashau.com/fonts/mv-oswald)                     | Regular                     | Download and web font                                                             |
| [MV Raadhavalhi](https://dvfonts.yashau.com/fonts/mv-raadhavalhi)           | Regular, Bold               | Download and web font                                                             |
| [MV Randhoo](https://dvfonts.yashau.com/fonts/mv-randhoo)                   | Regular                     | Download and web font                                                             |
| [MV Thaana Matrix 16](https://dvfonts.yashau.com/fonts/mv-thaana-matrix-16) | Regular                     | Download and web font                                                             |
| [MV Thaana Matrix 8](https://dvfonts.yashau.com/fonts/mv-thaana-matrix-8)   | Regular                     | Download and web font                                                             |
| [MV Thuththu Neo](https://dvfonts.yashau.com/fonts/mv-thuththu-neo)         | Regular, Bold               | Download and web font                                                             |
| [MV Thuththu](https://dvfonts.yashau.com/fonts/mv-thuththu)                 | Bold                        | Download and web font                                                             |
| [MV Typewriter](https://dvfonts.yashau.com/fonts/mv-typewriter)             | Regular, SemiBold, Bold     | Download and web font                                                             |
| [MV Uligamu](https://dvfonts.yashau.com/fonts/mv-uligamu)                   | Regular                     | Download and web font                                                             |
| [MV Utheemu](https://dvfonts.yashau.com/fonts/mv-utheemu)                   | Regular, Bold               | Download and web font                                                             |
| [MV Vaadhoo](https://dvfonts.yashau.com/fonts/mv-vaadhoo)                   | Regular, Bold               | Download and web font                                                             |

Removed at his request: **Aammu Hima Thedhu** (see `[excluded]` in [`families.toml`](families.toml)).

MV Funa's OpenType features are tested in Microsoft Word; some, such as the raised Thaana full stop, may not work in Adobe InDesign or other applications.
