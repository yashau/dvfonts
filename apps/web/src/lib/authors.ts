// Author bios (beta). Names match the credits in the catalogue (see authors() in catalog.ts).
// Authors with enough sourced information get a page at /authors/<slug>; the rest show a
// short note and an invitation to send what we're missing.

export interface AuthorBio {
	/** As credited in the catalogue. */
	name: string;
	slug: string;
	/** Name in Thaana, or null for studios, pseudonyms and non-Maldivian names. */
	thaana: string | null;
	/** False when no source gave the Thaana spelling and it's our best spelling. */
	thaanaVerified?: boolean;
	/** One line: what they do. */
	role: string;
	born?: string;
	knownFor?: string;
	website?: string;
	links?: { label: string; url: string }[];
	/** Paragraphs, plain English. */
	bio: string[];
	/** One or two sentences from the bio, shown above the font list. */
	excerpt: string;
	sources: { title: string; url: string }[];
	/** Has a dedicated page under /authors. */
	page: boolean;
}

/** Where corrections and missing details go. */
export const CORRECTIONS_EMAIL = 'ibrahim@yashau.com';

export function correctionsMailto(name: string): string {
	const subject = `fonts.mv author bio: ${name}`;
	const body = `Hi,\n\nI have a correction or more information about ${name}:\n\n`;
	return `mailto:${CORRECTIONS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Researched from public sources, cited per author. Thaana spellings no source confirmed
// carry thaanaVerified: false.
export const AUTHORS: AuthorBio[] = [
	{
		name: 'Abdulla Waheed',
		slug: 'abdulla-waheed',
		thaana: 'ޢަބްދުﷲ ވަޙީދު',
		role: 'Calligrapher',
		knownFor:
			"Thaana calligraphy at the President's Office, the basis of the A_Waheed / MV A Waheed and Aammu FK / MV Aammu FK fonts",
		bio: [
			"Abdulla Waheed is a Maldivian calligrapher from Eydhafushi in Baa Atoll who worked at the Office of the President. The Faruma designer Musthafa Mohamed, a classmate in the government's Thaana calligraphy class, describes Waheed's handwriting as the most beautiful Thaana he knows, and writes that official documents signed by the President were at the time written out by hand by Waheed.",
			"Hassan Hameed based his 1996 font A_Waheed, later MV A Waheed, on Waheed's lettering in a 1995 calendar of the Supreme Council for Islamic Affairs. Waheed reviewed the glyphs through Hassan Shujau, and the font is named after him. Hameed's bold display font Aammu FK, later MV Aammu FK, was made from a set of bold letters Waheed had drawn for stencil-cut banners. Waheed advised on the 2015 revisions of both fonts. His calligraphy is also credited in A_Faseyha, A_Utheem, Aammu FalaRasmee and A_Randhoo (1995), and in A Reethi (2002), made at the President's Office."
		],
		excerpt:
			'Abdulla Waheed is a Maldivian calligrapher from Eydhafushi in Baa Atoll who worked at the Office of the President. His Thaana lettering is the basis of MV A Waheed and MV Aammu FK.',
		sources: [
			{
				title: 'MV A Waheed – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/a_waheed/'
			},
			{
				title: 'MV AammuFK – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/mv-aammufk/'
			},
			{
				title: "Farumaa — from the designer's pen (Musthafa Mohamed), hassanhameed.com",
				url: 'https://hassanhameed.com/thaana-fonts/farumaa-from-the-designers-pen/'
			},
			{
				title: 'Luc Devroye, Hassan Hameed (Type Design Information Page)',
				url: 'https://luc.devroye.org/fonts-41690.html'
			},
			{
				title: 'Luc Devroye, Maldives (Type Design Information Page)',
				url: 'https://luc.devroye.org/maldives.html'
			},
			{
				title:
					"Font name tables: A_Waheed ('Named after the Calligrapher, Mr Abdulla Waheed of the Office of the President'), MV Aammu FK ('Calligraphy: Abdulla Waheed, Eydhafushi'), A_Faseyha, A_Utheem, A_Randhoo, A Reethi",
				url: 'https://fonts.mv'
			}
		],
		page: true
	},
	{
		name: 'Adam Zubin',
		slug: 'adam-zubin',
		thaana: 'އާދަމް ޒުބިން',
		thaanaVerified: false,
		role: 'Media designer, photographer and type designer',
		knownFor:
			'Zaana Thedhu, a nine-weight variable Thaana typeface (Thaana Type Foundry, 2021); brand identity, layout and photography work in the Maldives',
		website: 'http://www.adamzubin.com',
		links: [
			{
				label: 'adamzubin.com',
				url: 'http://www.adamzubin.com'
			},
			{
				label: 'Facebook',
				url: 'https://web.facebook.com/zubinadam'
			},
			{
				label: 'Flickr',
				url: 'http://www.flickr.com/photos/2652/'
			}
		],
		bio: [
			'Adam Zubin is a media designer and photographer based in Malé. His website says he co-founded and is a partner in mooinc. pvt. ltd., a multidisciplinary design and architecture firm in the Maldives. He trained in aquaculture, with a degree from James Cook University in Australia, and is self-taught as a designer. His portfolio includes brand identity, layout, photography, cinematography and marketing work for businesses, resorts, United Nations agencies and government ministries.',
			'His Thaana typeface Zaana Thedhu was released by Thaana Type Foundry in 2021. It is a variable font in nine weights, drawn to simplify the vertical arrangement of written Thaana for readability, and it uses Raleway for its Latin characters.'
		],
		excerpt:
			'Adam Zubin is a media designer and photographer based in Malé. His Thaana typeface Zaana Thedhu was released by Thaana Type Foundry in 2021.',
		sources: [
			{
				title: 'Adam Zubin: About',
				url: 'http://www.adamzubin.com/?page_id=2'
			},
			{
				title: 'Adam Zubin: portfolio',
				url: 'http://www.adamzubin.com'
			},
			{
				title: 'Thaana Type Foundry: Zaana Thedhu',
				url: 'https://thaana.com/zaana-thedhu/'
			}
		],
		page: true
	},
	{
		name: 'Adnan Ali',
		slug: 'adnan-ali',
		thaana: 'އަދުނާން އަލީ',
		thaanaVerified: false,
		role: 'Civil and structural engineer; type designer',
		knownFor:
			'Motaru Dhigu and Motaru Square (Thaana Type Foundry, 2021); founder and managing director of CVNG Consulting; the Dhivehi-language construction magazine Uvadhoani',
		website: 'https://www.cvng.net',
		links: [
			{
				label: 'CVNG Consulting',
				url: 'https://www.cvng.net'
			},
			{
				label: 'Uvadhoani',
				url: 'https://uvadhoani.com'
			},
			{
				label: 'LinkedIn',
				url: 'https://www.linkedin.com/in/adnan-ali-47b4583a/'
			}
		],
		bio: [
			'Adnan Ali is a Maldivian civil and structural engineer and the Chief Engineer and Managing Director of CVNG Consulting, an engineering consultancy in Malé. His company profile lists a B.Eng (Civil/Structural) and an M.Eng, and says he is a registered engineer in the Maldives with experience in structural design, transport engineering and airport planning.',
			'He designed two Thaana typefaces released by Thaana Type Foundry in 2021, both under the SIL Open Font License. Motaru Dhigu is based on natural handwriting and updates the long, stretched strokes of early-20th-century Dhivehi handwriting. He says the name honours his father. Motaru Square has perfectly square edges, so Thaana text can be stacked in regular patterns. He says the idea came from his work on the Uvadhoani project.',
			'Uvadhoani is an online magazine run by CVNG Consulting that publishes technical writing about construction in Dhivehi. Its About page says the team decided to set the new magazine in new fonts of its own, and that it was registered with the Ministry of Home Affairs in October 2021.'
		],
		excerpt:
			'Adnan Ali is a Maldivian civil and structural engineer and the Chief Engineer and Managing Director of CVNG Consulting, an engineering consultancy in Malé.',
		sources: [
			{
				title: 'Thaana Type Foundry: Motaru Dhigu',
				url: 'https://thaana.com/motaru-dhigu/'
			},
			{
				title: 'Thaana Type Foundry: Motaru Square',
				url: 'https://thaana.com/motaru-square/'
			},
			{
				title: 'CVNG Consulting: About us (team)',
				url: 'https://www.cvng.net/aboutus.php'
			},
			{
				title: 'Uvadhoani: About (އަޅުގަނޑުމެންގެ ވާހަކަ)',
				url: 'https://uvadhoani.com/aboutus.php'
			}
		],
		page: true
	},
	{
		name: 'Ashrag Rasheed',
		slug: 'ashrag-rasheed',
		thaana: 'އަޝްރަގު ރަޝީދު',
		thaanaVerified: false,
		role: 'Type designer',
		knownFor: 'Dhivehi Muraka, an OFL-licensed Thaana typeface published on GitHub in 2026',
		website: 'https://github.com/Viennnaa/dhivehi-muraka',
		links: [
			{
				label: 'GitHub: dhivehi-muraka',
				url: 'https://github.com/Viennnaa/dhivehi-muraka'
			},
			{
				label: 'Interactive specimen',
				url: 'https://viennnaa.github.io/dhivehi-muraka/specimen-interactive.html'
			}
		],
		bio: [
			'Ashrag Rasheed is the designer of Dhivehi Muraka, a Thaana typeface released under the SIL Open Font License on GitHub in 2026. It covers the full Unicode Thaana block and the new Rufiyaa sign. The project says every Thaana outline was drawn by hand, and it takes its Latin characters from Inter.'
		],
		excerpt:
			'Ashrag Rasheed is the designer of Dhivehi Muraka, a Thaana typeface released under the SIL Open Font License on GitHub in 2026.',
		sources: [
			{
				title: 'GitHub: Viennnaa/dhivehi-muraka (README)',
				url: 'https://github.com/Viennnaa/dhivehi-muraka'
			},
			{
				title: "Font name table of dhivehi-muraka.ttf: designer 'Ashrag Rasheed'; 'Thaana drawn by Ashrag Rasheed'",
				url: 'https://github.com/Viennnaa/dhivehi-muraka'
			}
		],
		page: false
	},
	{
		name: 'Ayeshath Fadwa',
		slug: 'ayeshath-fadwa',
		thaana: 'ޢާއިޝަތު ފަދްވާ',
		thaanaVerified: false,
		role: 'Graphic designer; co-founder of Thaana Type Foundry',
		knownFor:
			'Graphic design with a focus on Thaana typography; co-founding Thaana Type Foundry (thaana.com) with Shahee Ilyas',
		website: 'https://monochromist.com/',
		links: [
			{
				label: 'Portfolio (monochromist)',
				url: 'https://monochromist.com/'
			},
			{
				label: 'Thaana Type Foundry',
				url: 'https://thaana.com/'
			},
			{
				label: 'Instagram',
				url: 'https://www.instagram.com/mnchrmxst/'
			},
			{
				label: 'YouTube',
				url: 'https://www.youtube.com/@monochromist'
			},
			{
				label: 'Thaana Type on Instagram',
				url: 'https://www.instagram.com/thaanatype/'
			}
		],
		bio: [
			'Ayeshath Fadwa Waheed, who also goes by Ayesh, is a Maldivian graphic designer. Her portfolio describes her work as design, layout, illustration and branding, with a particular focus on Thaana typography, and says she has more than 25 years of experience. Clients listed there include Bank of Maldives, DHL Maldives, the National Art Gallery of Maldives, Transparency Maldives, UNDP Maldives, UNICEF Maldives and UNFPA Maldives.',
			"With Shahee Ilyas she runs Thaana Type, a Maldivian type foundry that publishes free Thaana fonts under the SIL Open Font License. It went public with its first releases in 2020. According to the foundry, it 'came into being' in Vietnam, and it named its Viethaana font as a tribute to Saigon. The two had earlier designed and developed Nakaiy Nevi (2012), a mobile app for the traditional Maldivian nakaiy calendar.",
			"Her own designs for the foundry include Kolhu, Theras, Masnooee Mono and Viethaana (2020), as well as Faaru Punk, Gurafiku and LCD Thaana (2021). Faaru Punk grew out of letters she drew for the logo of the band Kushehnooney's second album, Lah. With Shahee Ilyas she co-designed Bolhu, Fanara, Fanara Golhi, Faagathi Dheli and Faagathi Neon. The Faagathi fonts are based on early-20th-century manuscripts by the scholar Salaahuddin. Fanara Golhi received a Special Mention in the South Asian Scripts text typefaces category of the 12th Granshan Type Design Competition (2021/22)."
		],
		excerpt:
			'Ayeshath Fadwa Waheed is a Maldivian graphic designer with a particular focus on Thaana typography. With Shahee Ilyas she runs Thaana Type, a foundry that publishes free Thaana fonts.',
		sources: [
			{
				title: 'monochromist: Ayeshath Fadwa Waheed (portfolio, about)',
				url: 'https://monochromist.com/'
			},
			{
				title: 'Thaana Type Foundry',
				url: 'https://thaana.com/'
			},
			{
				title: 'Faaru Punk – Thaana Type Foundry',
				url: 'https://thaana.com/faaru-punk/'
			},
			{
				title: 'Viethaana – Thaana Type Foundry',
				url: 'https://thaana.com/viethaana/'
			},
			{
				title: 'Faagathi Dheli – Thaana Type Foundry',
				url: 'https://thaana.com/faagathi-dheli/'
			},
			{
				title: 'Fanara Golhi – Thaana Type Foundry',
				url: 'https://thaana.com/fanara-golhi/'
			},
			{
				title: 'Thaana Type – Shahee Ilyas (project page, credits and award)',
				url: 'https://shaheeilyas.com/project/thaana-type/'
			},
			{
				title: 'Nakaiy Nevi – Shahee Ilyas',
				url: 'https://shaheeilyas.com/project/nakaiy-nevi/'
			}
		],
		page: true
	},
	{
		name: 'David Williams',
		slug: 'david-williams',
		thaana: null,
		role: 'Type designer',
		knownFor: 'Credited designer of Noto Sans Thaana (Google Noto project)',
		links: [
			{
				label: 'Noto Thaana (GitHub)',
				url: 'https://github.com/notofonts/thaana'
			},
			{
				label: 'Noto Sans Thaana (Google Fonts)',
				url: 'https://fonts.google.com/noto/specimen/Noto+Sans+Thaana'
			}
		],
		bio: [
			"David Williams is the credited designer of Noto Sans Thaana, the Thaana member of Google's Noto font family. The current version (3.x, 2022) is a sans-serif design in several weights, released under the SIL Open Font License, with Google as the manufacturer."
		],
		excerpt: "David Williams is the credited designer of Noto Sans Thaana, part of Google's Noto font family.",
		sources: [
			{
				title: 'notofonts/thaana – NotoSansThaana.glyphs (designer = "David Williams"; manufacturer = "Google Inc.")',
				url: 'https://github.com/notofonts/thaana'
			},
			{
				title: 'Noto Sans Thaana documentation (notofonts)',
				url: 'https://github.com/notofonts/thaana/blob/main/documentation/NotoSansThaana.article.html'
			}
		],
		page: false
	},
	{
		name: 'Hasan Shazil',
		slug: 'hasan-shazil',
		thaana: 'ހަސަން ޝާޒިލް',
		thaanaVerified: false,
		role: 'Type designer',
		knownFor: 'Haluvidhaa, Hawwa and Sangu Suruhee (Thaana Type Foundry, 2021), and Suruhee Outlined',
		links: [
			{
				label: 'Instagram (@has_n)',
				url: 'https://www.instagram.com/has_n/'
			},
			{
				label: 'GitHub (hshazil84)',
				url: 'https://github.com/hshazil84/Dhivehi-fonts'
			},
			{
				label: 'Thaana Type Foundry',
				url: 'https://thaana.com'
			}
		],
		bio: [
			'Hasan Shazil is a Maldivian type designer. In 2021 he contributed three fonts to Thaana Type Foundry: Haluvidhaa, a slanted, bubbly display face; Hawwa, a brush font that imitates ink handwriting; and Sangu Suruhee.',
			'Sangu Suruhee revives the headline lettering of Sangu, a 1990 news magazine. That lettering was first made as a stencil by Adam Ibrahim (Fankaa) for Studio-1, and Shazil redrew and digitised it. Thaana Type Foundry presents it as a tribute to the layout artists of the independent press that appeared after the political liberalisation of 1989. A second version was released in 2026. He has also published Suruhee Outlined (2026) on GitHub.'
		],
		excerpt:
			'Hasan Shazil is a Maldivian type designer. In 2021 he contributed three fonts to Thaana Type Foundry: Haluvidhaa, a slanted, bubbly display face; Hawwa, a brush font that imitates ink handwriting; and Sangu Suruhee.',
		sources: [
			{
				title: 'Thaana Type Foundry: Haluvidhaa',
				url: 'https://thaana.com/haluvidhaa/'
			},
			{
				title: 'Thaana Type Foundry: Hawwa',
				url: 'https://thaana.com/hawwa/'
			},
			{
				title: 'Thaana Type Foundry: Sangu Suruhee',
				url: 'https://thaana.com/sangu-suruhee/'
			},
			{
				title: 'GitHub: hshazil84/Dhivehi-fonts',
				url: 'https://github.com/hshazil84/Dhivehi-fonts'
			}
		],
		page: true
	},
	{
		name: 'Hassan Hameed',
		slug: 'hassan-hameed',
		thaana: 'ޙަސަން ޙަމީދު',
		role: 'Type designer, educator and writer',
		knownFor:
			'Many of the most widely used Thaana fonts, including MV A Waheed, MV Aammu FK, MV Faseyha, MV Randhoo, MV Typewriter and MV Funa; former Vice-Chancellor of the Maldives National University',
		website: 'https://hassanhameed.com',
		links: [
			{
				label: 'hassanhameed.com',
				url: 'https://hassanhameed.com'
			},
			{
				label: 'Thaana fonts (hassanhameed.com)',
				url: 'https://hassanhameed.com/thaana-fonts/'
			}
		],
		bio: [
			"Hassan Hameed, usually credited as Dr Hassan Hameed, is a Maldivian educator, writer and Thaana type designer. He has written that he studied computer science at the University of Tasmania from 1980, and that he was studying in New Zealand in 1995. He worked at the Maldives College of Higher Education and its successor, the Maldives National University (MNU), from 1998, served as Rector of the college, and was elected the university's Vice-Chancellor in 2011. He resigned in July 2015 after amendments to the national university law. In August 2019 he was appointed Chancellor of MNU.",
			"Hameed began making Thaana fonts in the mid-1990s, working with Hassan Shujau and the calligrapher Abdulla Waheed of the President's Office. Their pre-Unicode fonts from 1995 and 1996, such as A_Faseyha, A_Randhoo, A_Utheem and A_Waheed, were based on Waheed's handwriting. From 2015 he reworked these designs as Unicode fonts with OpenType features under the MV prefix, among them MV A Waheed and MV Aammu FK, a heavy display face widely used for newspaper headlines.",
			'He has written that he has released about 35 fonts over some 30 years, and that his fonts are the ones most used by Maldivian online newspapers. MV Funa began as a font he released in 1999 with a Thaana word-processing program and later used for MNU publications; it was later published in four weights. He also made the Thaana for MV Oswald and MV Open Condensed, pairing it with existing Latin typefaces.',
			'Beyond type design, Hameed writes on the Dhivehi language, the history of Thaana and Thaana typography, engineering, education and the history of MNU, and publishes much of this work on his website. In 2000 he presented the paper "Gabulhi Thaana: A challenge for information technology" at a writers\' conference held by the National Centre for Linguistic and Historical Research.'
		],
		excerpt:
			'Hassan Hameed, usually credited as Dr Hassan Hameed, is a Maldivian educator, writer and Thaana type designer. He began making Thaana fonts in the mid-1990s, and his designs include MV A Waheed, MV Aammu FK, MV Faseyha and MV Funa.',
		sources: [
			{
				title: 'Thaana fonts – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/'
			},
			{
				title: 'MV A Waheed – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/a_waheed/'
			},
			{
				title: 'MV AammuFK – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/mv-aammufk/'
			},
			{
				title: 'MV Funa — a much-demanded font in four weights – hassanhameed.com',
				url: 'https://hassanhameed.com/thaana-fonts/mv-funa-a-much-demanded-font-in-four-weights/'
			},
			{
				title: "Farumaa — from the designer's pen (Musthafa Mohamed), hassanhameed.com",
				url: 'https://hassanhameed.com/thaana-fonts/farumaa-from-the-designers-pen/'
			},
			{
				title:
					'On social media, an outpouring of support for ex university vice chancellor (Minivan News / Maldives Independent, 12 July 2015)',
				url: 'https://minivannewsarchive.com/?p=100805'
			},
			{
				title:
					"President appoints Chancellors to Maldives National University and Islamic University of Maldives (President's Office, 20 August 2019)",
				url: 'https://presidency.gov.mv/Press/Article/21828'
			},
			{
				title: 'Luc Devroye, Hassan Hameed (Type Design Information Page)',
				url: 'https://luc.devroye.org/fonts-41690.html'
			},
			{
				title: 'fonts/sources name tables (A_Waheed, A_Faseyha, A_Randhoo, MV Oswald)',
				url: 'https://fonts.mv'
			}
		],
		page: true
	},
	{
		name: 'Hussain Niyaz',
		slug: 'hussain-niyaz',
		thaana: 'ހުސައިން ނިޔާޒް',
		role: 'Type designer; creator and operator of dhivehifont.com',
		born: 'Lhohi, Noonu Atoll',
		knownFor:
			"The MV Izyan family and dozens of other handwriting-style and display Thaana fonts published on dhivehifont.com, several of them digitised from real people's handwriting",
		website: 'https://dhivehifont.com',
		links: [
			{
				label: 'dhivehifont.com',
				url: 'https://dhivehifont.com'
			},
			{
				label: 'Font library (dhivehifont.com)',
				url: 'https://dhivehifont.com/myfonts'
			},
			{
				label: 'Buy Me a Coffee',
				url: 'https://buymeacoffee.com/hniyazmv'
			}
		],
		bio: [
			'Hussain Niyaz is a Maldivian type designer from Lhohi in Noonu Atoll. He runs dhivehifont.com, where he publishes his own Thaana fonts. Font files credit him as "Hussain Niyaz (Noonu Lhohi)". On the site\'s About page he writes that he had considered making Dhivehi fonts for years and had started several times with font software, stopping each time, before the project finally got under way.',
			'The earliest font release on the site is dated December 2021. A larger batch followed in April 2022, and he has kept releasing new designs since then, most recently in 2026. His work centres on the MV Izyan family, which includes handwriting, Bodu Akuru, 3D, Light, Thin, Edge, Suruhee and other variants. He describes many of his fonts as meant for headlines, cards, posters and other short, informal text rather than long passages.',
			"Several of his fonts are named after people and places in his life. MV Lhohi, his second font, and MV Gaa Lhohi are named after his home island. MV Fathimath and MV Maryam are named after his grandmothers, and MV Nerumagu after a harbour road on his island. Others digitise real handwriting. MV Nevi Raheem is based on the handwriting of the late Abdul Raheem Abubakuru of N. Manadhoo and was made after talking with his family. MV Alram reproduces the handwriting of Ali Rameez of N. Lhohi. MV Azheel and MV Azheel Rasmee are based on the handwriting of Azheel Ahmed, and MV Meemu Ali on the quick note-taking hand of Mohamed Ali. MV Edhuru is based on the lettering in Ali Edhuru Thakurufaanu's book Zuhurul Kamaalaathi fee Ahkaamil Ibaadhaathi.",
			"Besides fonts, the site publishes vector artwork, such as a drawing of the Maldivian state emblem (2024) and Eid-themed vectors (2025). Most fonts in the site's library are marked as free. Some other items, such as the vector files, are sold, and he takes donations through Buy Me a Coffee."
		],
		excerpt:
			'Hussain Niyaz is a Maldivian type designer from Lhohi in Noonu Atoll. He runs dhivehifont.com, where he publishes his own Thaana fonts.',
		sources: [
			{
				title: 'dhivehifont.com: About page (އަހަރުމެން)',
				url: 'https://dhivehifont.com/%de%87%de%a6%de%80%de%a6%de%83%de%aa%de%89%de%ac%de%82%de%b0'
			},
			{
				title: 'dhivehifont.com: font library',
				url: 'https://dhivehifont.com/myfonts'
			},
			{
				title: 'dhivehifont.com: MV Izyan Athuliyun (2021-12-30, earliest post)',
				url: 'https://dhivehifont.com/archives/34459'
			},
			{
				title: 'dhivehifont.com: MV Lhohi (birth island N. Lhohi; his second font)',
				url: 'https://dhivehifont.com/archives/34703'
			},
			{
				title: 'dhivehifont.com: MV Gaa Lhohi',
				url: 'https://dhivehifont.com/archives/34702'
			},
			{
				title: 'dhivehifont.com: MV Fathimath',
				url: 'https://dhivehifont.com/archives/34995'
			},
			{
				title: 'dhivehifont.com: MV Maryam',
				url: 'https://dhivehifont.com/archives/35005'
			},
			{
				title: 'dhivehifont.com: MV Nevi Raheem',
				url: 'https://dhivehifont.com/archives/34696'
			},
			{
				title: 'dhivehifont.com: MV Alram',
				url: 'https://dhivehifont.com/archives/34697'
			},
			{
				title: 'dhivehifont.com: MV Edhuru',
				url: 'https://dhivehifont.com/archives/34704'
			},
			{
				title: 'dhivehifont.com: MV Nerumagu',
				url: 'https://dhivehifont.com/archives/35141'
			},
			{
				title: 'dhivehifont.com: MV Meemu Ali',
				url: 'https://dhivehifont.com/archives/35175'
			},
			{
				title: 'dhivehifont.com: MV Azheel',
				url: 'https://dhivehifont.com/archives/35213'
			},
			{
				title: 'dhivehifont.com: State emblem vector',
				url: 'https://dhivehifont.com/archives/35262'
			},
			{
				title: 'dhivehifont.com: Fanu Dhooni vector (sold)',
				url: 'https://dhivehifont.com/archives/35664'
			},
			{
				title: 'Buy Me a Coffee: Free Dhivehi Font (2022)',
				url: 'https://buymeacoffee.com/hniyazmv/free-dhivehi-font'
			},
			{
				title:
					"Font name tables (mv-azheel.ttf, mv-mohamed-ali-final.ttf, etc.): 'Copyright (C) 2021 by Hussain Niyaz', designer 'Hussain Niyaz(Noonu Lhohi)'",
				url: 'https://dhivehifont.com'
			}
		],
		page: true
	},
	{
		name: 'Hussain Shameem',
		slug: 'hussain-shameem',
		thaana: 'ޙުސައިން ޝަމީމު',
		role: 'Calligrapher (handwriting basis of the Magey Huseynu font)',
		knownFor: 'His handwriting, the basis of the Magey Huseynu font (Loopcraft / RaajjeType, 2024)',
		links: [
			{
				label: 'Magey Huseynu (RaajjeType)',
				url: 'https://theloopcraft.com/raajjetype/magey-huseynu'
			}
		],
		bio: [
			"Hussain Shameem is the Maldivian calligrapher whose handwriting is the basis of Magey Huseynu, a free Thaana font made with Loopcraft's RaajjeType foundry and launched in February 2024 with an exhibition at the art gallery in Malé. The font's name, 'Magey Huseynu' ('my Husain'), is what his mother called him.",
			"In his own account, he learned to love writing as a child, sitting beside his father, the late Gonbili Mohamed Shameem. His father was a calligrapher of Thaana and Arabic who spent hours each day hand-lettering the newspaper Haveeru while it was still produced by hand. Shameem says his handwriting developed over many years. In 2023 he entered the Dhivehi Language Academy's national handwriting competition; his entry did not place, but the judges chose it for public display. He describes the font as his art."
		],
		excerpt:
			"Hussain Shameem is the Maldivian calligrapher whose handwriting is the basis of Magey Huseynu, a free Thaana font launched with Loopcraft's RaajjeType foundry in 2024.",
		sources: [
			{
				title:
					"Magey Huseynu – RaajjeType / Loopcraft (his own account, in Dhivehi; page meta credits 'PG Hussain Shameem')",
				url: 'https://theloopcraft.com/raajjetype/magey-huseynu'
			},
			{
				title: "RaajjeType on X: launch of Magey Huseynu, 'a collaboration between Hussain Shameem and RaajjeType'",
				url: 'https://x.com/raajjetype/status/1762828133135458555'
			},
			{
				title: 'Hussain Shameem – Wikipedia',
				url: 'https://en.wikipedia.org/wiki/Hussain_Shameem'
			}
		],
		page: true
	},
	{
		name: 'Ibrahim Yasir',
		slug: 'ibrahim-yasir',
		thaana: 'އިބްރާހީމް ޔާސިރު',
		role: "Font developer (IT staff, President's Office)",
		knownFor: "Building the Faruma and A Reethi fonts digitally at the President's Office in 2002",
		bio: [
			"Ibrahim Yasir was a member of the IT unit at the Maldivian President's Office who produced the digital font files for Faruma and A Reethi in 2002. According to Musthafa Mohamed, who designed Faruma's letterforms, the head of IT, Ahmed Asif, assigned Yasir to the project. Yasir, who was trained in IT, drew and adjusted the glyphs as Mohamed directed, working at his own workstation, and the first usable version was ready in about three months.",
			'The first stage of the font was named A_Reethi; after further refinement it was released as A_Faruma and then Faruma. The font files credit Yasir as creator, with calligraphy by Musthafa Mohamed (and, for A Reethi, also by Abdul Sattar and Abdulla Waheed) and assistance from Ahmed Asif. Faruma came to be widely used for official government documents in the Maldives.'
		],
		excerpt:
			"Ibrahim Yasir was a member of the IT unit at the Maldivian President's Office who produced the digital font files for Faruma and A Reethi in 2002.",
		sources: [
			{
				title: "Farumaa — from the designer's pen (Musthafa Mohamed, 17 May 2023), hassanhameed.com",
				url: 'https://hassanhameed.com/thaana-fonts/farumaa-from-the-designers-pen/'
			},
			{
				title: 'Luc Devroye, Maldives (Type Design Information Page)',
				url: 'https://luc.devroye.org/maldives.html'
			},
			{
				title:
					"Font name tables: Faruma ('Created by Ibrahim Yasir, Calligraphy by Musthafa Mohamed, Assisted by Ahmed Asif. The President's Office 2002'), A Reethi",
				url: 'https://fonts.mv'
			}
		],
		page: true
	},
	{
		name: 'Loopcraft',
		slug: 'loopcraft',
		thaana: 'ލޫޕްކްރާފްޓް',
		role: 'Design and technology studio, Malé; publishes fonts through its foundry RaajjeType',
		knownFor:
			'Design, software and branding studio in Malé; its RaajjeType foundry publishes free Thaana fonts based on handwriting and calligraphy',
		website: 'https://theloopcraft.com/',
		links: [
			{
				label: 'Website',
				url: 'https://theloopcraft.com/'
			},
			{
				label: 'RaajjeType',
				url: 'https://theloopcraft.com/raajjetype'
			},
			{
				label: 'RaajjeType on X',
				url: 'https://x.com/raajjetype'
			}
		],
		bio: [
			'Loopcraft is a design and technology company based in Malé, Maldives. It works in branding, software and app development, 3D and animation, and marketing. Its own products have included the augmented-reality education app Butterfly Story and the Foodies delivery app. Its chief executive is Mohamed Shamheel.',
			"The company publishes Thaana fonts through its own foundry, RaajjeType. According to Shamheel, it set up the foundry because the lack of varied Dhivehi fonts made design work difficult. RaajjeType's fonts include Thundu (from calligraphy by Lazzath) and Fanvaiy, as well as two fonts based on the handwriting of individual calligraphers: Magey Huseynu, from the calligraphy of Hussain Shameem (launched in February 2024), and Dhanbumaa, from the handwriting of the late Mohamed Faiz (Dhanbumaa Faiz), launched on 10 August 2025 with his family. Both are free to use."
		],
		excerpt:
			'Loopcraft is a design and technology company in Malé, Maldives. Through its foundry RaajjeType it publishes free Thaana fonts, including Magey Huseynu and Dhanbumaa.',
		sources: [
			{
				title: 'Loopcraft – home',
				url: 'https://theloopcraft.com/'
			},
			{
				title: 'Loopcraft – About',
				url: 'https://theloopcraft.com/about'
			},
			{
				title: 'Loopcraft – RaajjeType',
				url: 'https://theloopcraft.com/raajjetype'
			},
			{
				title: 'Loopcraft – Newsroom',
				url: 'https://theloopcraft.com/newsroom'
			},
			{
				title: 'Dhanbumaa – RaajjeType / Loopcraft',
				url: 'https://theloopcraft.com/raajjetype/dhanbumaa'
			},
			{
				title: 'Magey Huseynu – RaajjeType / Loopcraft',
				url: 'https://theloopcraft.com/raajjetype/magey-huseynu'
			},
			{
				title: 'ދަނބުމާ ފާއިޒު ދަރިންނަށް ހަދިޔާކުރި ރީތި އަތުލިއުން ފޮންޓަކަށް (Mihaaru, 10 Aug 2025)',
				url: 'https://mihaaru.com/business/148216'
			},
			{
				title: 'RaajjeType on X: Magey Huseynu launch (28 Feb 2024)',
				url: 'https://x.com/raajjetype/status/1762828133135458555'
			}
		],
		page: true
	},
	{
		name: 'M.A. Gadir',
		slug: 'm-a-gadir',
		thaana: 'މުޙައްމަދު ޢަބްދުލްގާދިރު',
		thaanaVerified: false,
		role: 'Type designer (Sehga Soft)',
		knownFor:
			'Thaana fonts released under the Sehga Soft name: MV Elaaf, MV Iyyu, MV MAG Round, MV Sehga FB, MV Lady Luck and others',
		bio: [
			'M.A. Gadir (Mohamed Abdul Gadir) is a Maldivian designer of Thaana fonts, based in Malé, who released them under the name Sehga Soft. His fonts include MV Elaaf, MV Iyyu, MV Iyyu Nala, MV MAG Round, MV Sehga FB, MV Sehga Old and MV Lady Luck. Later fonts such as MV Iyyu Formal and MV Elaaf Formal (2005) carry the note "Design & Developed by M.A.Gadir". MV Radhun (March 2005) was developed with Hassan Saeed and Abdulla Waheed of the President\'s Office, and MV GroupX Avas is credited to Gadir and Sappe.'
		],
		excerpt:
			'M.A. Gadir (Mohamed Abdul Gadir) is a Maldivian designer of Thaana fonts, based in Malé, who released them under the name Sehga Soft.',
		sources: [
			{
				title: 'Luc Devroye, Maldives (Type Design Information Page): fonts by M.A. Gadir for Sehga Soft',
				url: 'https://luc.devroye.org/maldives.html'
			},
			{
				title:
					"Font name tables: MV Lady Luck ('Mohamed Abdul Gadir. Goalhithereyge. Male''), MV Elaaf/Iyyu ('M.A.Gadir for Sehga Soft'), MV Iyyu Formal ('Design & Developed by M.A.Gadir... Ver: August 2005'), MV Radhun ('Developed by M.A.Gadir in relation with Hassan Saeed and Abdulla Waheed of Presidents Office. March 2005'), MV GroupX Avas ('M.A.Gadir & Sappe')",
				url: 'https://fonts.mv'
			}
		],
		page: false
	},
	{
		name: 'Maldivian Internet Task Force',
		slug: 'maldivian-internet-task-force',
		thaana: null,
		role: 'Volunteer non-profit group (MITF)',
		knownFor: 'Thaana Unicode Akeh (2000), an early free Unicode Thaana font',
		website: 'http://www.mitf.f2s.com',
		links: [
			{
				label: 'MITF website (archived, 2002)',
				url: 'https://web.archive.org/web/2002/http://www.mitf.f2s.com/'
			},
			{
				label: 'Project Thaana on SourceForge',
				url: 'https://sourceforge.net/projects/thaana/'
			}
		],
		bio: [
			'The Maldivian Internet Task Force (MITF) was a volunteer, non-profit group that described itself as a catalyst for Maldivian internet and computer projects. Its members, many of them Maldivians living abroad, worked on Thaana software such as editors, transliteration engines and a Unicode encoder, ran the alt.culture.maldives newsgroup, and in 2001 moved their Thaana work into Project Thaana on SourceForge.',
			'Because few Unicode Thaana fonts existed at the time, MITF made its own. Thaana Unicode Akeh, dated 2000, covers Latin-1 and Thaana with a few Arabic characters, and was released free of charge under the GNU Free Documentation License.'
		],
		excerpt:
			'The Maldivian Internet Task Force (MITF) was a volunteer, non-profit group that described itself as a catalyst for Maldivian internet and computer projects. Its Thaana Unicode Akeh (2000) was an early free Unicode Thaana font.',
		sources: [
			{
				title: 'MITF: Maldivian Internet Task Force, home page (archived January 2002)',
				url: 'https://web.archive.org/web/2002/http://www.mitf.f2s.com/'
			},
			{
				title: 'MITF FAQ (archived 2002)',
				url: 'https://web.archive.org/web/2002/http://www.mitf.f2s.com/index.php3?SHOW=mitf/faq.html'
			},
			{
				title: 'MITF Community / People (archived 2002)',
				url: 'https://web.archive.org/web/2002/http://www.mitf.f2s.com/index.php3?SHOW=people/index.html'
			},
			{
				title: 'Project Thaana: Unicode Fonts (archived 2002)',
				url: 'https://web.archive.org/web/2002/http://www.mitf.f2s.com/index.php3?SHOW=projects/thaana/font-unicode.html'
			},
			{
				title: 'MITF Thaana Unicode Akeh fonts – Fedora Project Wiki',
				url: 'https://fedoraproject.org/wiki/MITF_Thaana_Unicode_Akeh_fonts'
			},
			{
				title: "Thaana Unicode Akeh font name table ('(C) 2000 Maldivian Internet Task Force')",
				url: 'https://fonts.mv'
			}
		],
		page: true
	},
	{
		name: 'Mohamed Ali',
		slug: 'mohamed-ali',
		thaana: 'މުޙައްމަދު އަލީ',
		thaanaVerified: false,
		role: 'Co-credited contributor; his handwriting is the basis of MV Meemu Ali',
		knownFor: 'The handwriting behind MV Meemu Ali by Hussain Niyaz',
		bio: [
			'Mohamed Ali, from Maavah in Laamu Atoll according to the font credits, is co-credited with Hussain Niyaz on MV Meemu Ali, MV Izyan Lhohi and MV Izyan Reethi. Hussain Niyaz describes MV Meemu Ali as modelled on the quick handwriting Mohamed Ali used for meeting notes and draft letters.'
		],
		excerpt:
			'Mohamed Ali, from Maavah in Laamu Atoll according to the font credits, is co-credited with Hussain Niyaz on MV Meemu Ali, MV Izyan Lhohi and MV Izyan Reethi.',
		sources: [
			{
				title: 'dhivehifont.com: MV Meemu Ali (2023-07-24)',
				url: 'https://dhivehifont.com/archives/35175'
			},
			{
				title:
					"Font name table of mv-mohamed-ali-final.ttf, mv-izyan-lhohi.ttf, mvizyanreethi-bold.ttf: designer 'Hussain Niyaz(Noonu Lhohi). Mohamed Ali( Laamu Maavah)'",
				url: 'https://dhivehifont.com/myfonts'
			}
		],
		page: false
	},
	{
		name: 'Mohamed Azheel',
		slug: 'mohamed-azheel',
		thaana: 'މުޙައްމަދު އަޒްހީލް',
		thaanaVerified: false,
		role: 'Co-credited contributor; his handwriting is the basis of MV Azheel',
		knownFor: 'The handwriting behind MV Azheel and MV Azheel Rasmee by Hussain Niyaz',
		bio: [
			'MV Azheel (2023) is a font by Hussain Niyaz, made from the handwriting of a man named Azheel. Hussain Niyaz scanned the writing into Illustrator and redrew the letters there. The release post calls him Azheel Ahmed (Fiyoaree) and describes him as a teacher of the Quran who supports the font project. The font file credits him as Mohamed Azheel. A second font from his handwriting, MV Azheel Rasmee, followed in 2024.'
		],
		excerpt: 'MV Azheel (2023) is a font by Hussain Niyaz, made from the handwriting of a man named Azheel.',
		sources: [
			{
				title: 'dhivehifont.com: MV Azheel (2023-11-14)',
				url: 'https://dhivehifont.com/archives/35213'
			},
			{
				title: 'dhivehifont.com: MV Azheel Rasmee (2024-06-15)',
				url: 'https://dhivehifont.com/archives/35405'
			},
			{
				title: "Font name table of mv-azheel.ttf: designer 'Hussain Niyaz(Noonu Lhohi). Mohamed Azheel'",
				url: 'https://dhivehifont.com/myfonts'
			}
		],
		page: false
	},
	{
		name: 'Mohamed Faiz',
		slug: 'mohamed-faiz',
		thaana: 'މުޙައްމަދު ފާއިޒް',
		role: 'Calligrapher (handwriting basis of the Dhanbumaa font); businessman',
		knownFor: 'His handwriting, the basis of the Dhanbumaa font; the Dhanbumaa hotaa (café) business in Malé',
		links: [
			{
				label: 'Dhanbumaa (RaajjeType)',
				url: 'https://theloopcraft.com/raajjetype/dhanbumaa'
			}
		],
		bio: [
			'Mohamed Faiz, known as Dhanbumaa Faiz, was a Maldivian businessman and amateur calligrapher who died in March 2024. He was best known for running cafés (hotaa) under the Dhanbumaa name in Malé, and he also ran restaurants and a wedding catering service. He worked in the post office, finance and agriculture sectors. In the late 1960s he ran a madrasa, Madhrasathul Ibthidhaaiyya, from his home and served as its headmaster (naazir).',
			"Calligraphy was a lifelong hobby for him, in both Arabic and Thaana. Much of his writing survives in exercise books, and he gave his children a handwritten recipe book. When his family found they could not reproduce the book directly, they worked with Loopcraft's RaajjeType foundry to turn his handwriting into a font. Dhanbumaa was launched on 10 August 2025 in Regular and Bold; the bold weight is based on the headings in the recipe book. The font is free to use, and the family plans to publish his recipe book set in it."
		],
		excerpt:
			'Mohamed Faiz (Dhanbumaa Faiz) was a Maldivian businessman and amateur calligrapher whose handwriting is the basis of the Dhanbumaa font.',
		sources: [
			{
				title: 'Dhanbumaa – RaajjeType / Loopcraft (family tribute and biography by Hoarafushi Mohamed Saleem)',
				url: 'https://theloopcraft.com/raajjetype/dhanbumaa'
			},
			{
				title: 'ދަނބުމާ ފާއިޒު ދަރިންނަށް ހަދިޔާކުރި ރީތި އަތުލިއުން ފޮންޓަކަށް (Mihaaru, 10 Aug 2025)',
				url: 'https://mihaaru.com/business/148216'
			}
		],
		page: true
	},
	{
		name: 'Mohamed Mazeed',
		slug: 'mohamed-mazeed',
		thaana: 'މުޙައްމަދު މަޒީދު',
		thaanaVerified: false,
		role: 'Font designer',
		knownFor: 'The DAM series of Thaana fonts (DAM Hiyani, DAM Kalhi, DAM Kathivalhi, DAM Madheeh)',
		bio: [
			"Mohamed Mazeed is the designer of the DAM series of Thaana fonts, which includes DAM Hiyani, DAM Kalhi, DAM Kathivalhi and DAM Madheeh. The fonts' embedded copyright notices credit him with the digitised data and date it to 2000–2002. Little else about him is publicly documented."
		],
		excerpt: 'Mohamed Mazeed is the designer of the DAM series of Thaana fonts, digitised between 2000 and 2002.',
		sources: [
			{
				title:
					"Font metadata (name table) of DAM_Hiyani ('Digitized data © 2002, Mohamed Mazeed'), DAM_Kathivalhi ('© 2000-2001, Mohamed Mazeed') and DAM_Kalhi ('© Mohamed Mazeed')",
				url: 'https://dhivehi.mv/fonts/'
			}
		],
		page: false
	},
	{
		name: 'Nexus Maldives Pvt. Ltd',
		slug: 'nexus-maldives-pvt-ltd',
		thaana: null,
		role: 'Company (real estate and tourism, Malé)',
		knownFor: 'Samee Avas Thaana, from its free Dhivehi fonts service',
		website: 'http://www.nexus.com.mv/',
		links: [
			{
				label: 'Nexus Online Services (archived)',
				url: 'https://web.archive.org/web/2005/http://www.nexus.com.mv:80/onlineservices/index.htm'
			}
		],
		bio: [
			'Nexus Maldives Pvt. Ltd is a Malé company in real estate, construction and tourism, formed in 1999 according to its website. Around 2000 it offered free Thaana online services: Dhivehi e-mail, a Dhivehi chat program and a collection of free Dhivehi fonts. The fonts were meant to make different styles of handwriting available to the public. Samee Avas Thaana, dated 1999 with a 2020 update, comes from that collection.'
		],
		excerpt:
			'Nexus Maldives Pvt. Ltd is a Malé company in real estate, construction and tourism. Around 2000 it offered free Thaana online services, including a collection of free Dhivehi fonts.',
		sources: [
			{
				title: 'Nexus Maldives – Company Profile (archived 2005)',
				url: 'https://web.archive.org/web/2005/http://www.nexus.com.mv:80/profile.htm'
			},
			{
				title: 'Nexus Maldives – Online Services (archived 2005)',
				url: 'https://web.archive.org/web/2005/http://www.nexus.com.mv:80/onlineservices/index.htm'
			},
			{
				title: "Samee Avas Thaana font name table ('Nexus Maldives Pvt. Ltd. 1999, 2020')",
				url: 'https://fonts.mv'
			}
		],
		page: false
	},
	{
		name: 'Sappe',
		slug: 'sappe',
		thaana: null,
		role: 'Co-designer (nickname; identity unknown)',
		knownFor: 'Co-credit on MV GroupX Avas',
		bio: [
			'Sappe is credited with M.A. Gadir on the handwriting-style font MV GroupX Avas. The name appears to be a nickname, and no further information about the person has been found.'
		],
		excerpt: 'Sappe is credited with M.A. Gadir on the handwriting-style font MV GroupX Avas.',
		sources: [
			{
				title: "MV GroupX Avas font name table: copyright 'M.A.Gadir & Sappe'",
				url: 'https://fonts.mv'
			}
		],
		page: false
	},
	{
		name: 'Shahee Ilyas',
		slug: 'shahee-ilyas',
		thaana: 'ޝާހީ އިލްޔާސް',
		thaanaVerified: false,
		role: 'Transdisciplinary designer and researcher; co-founder of Thaana Type Foundry',
		knownFor: "Thaana Type Foundry (with Ayeshath Fadwa); data visualisation work including 'Flags by Colours' (2007)",
		website: 'https://shaheeilyas.com/',
		links: [
			{
				label: 'Website',
				url: 'https://shaheeilyas.com/'
			},
			{
				label: 'Thaana Type Foundry',
				url: 'https://thaana.com/'
			},
			{
				label: 'Instagram',
				url: 'https://www.instagram.com/shaheeilyas/'
			},
			{
				label: 'LinkedIn',
				url: 'https://www.linkedin.com/in/shaheeilyas/'
			},
			{
				label: 'Monoskop',
				url: 'https://monoskop.org/Shahee_Ilyas'
			}
		],
		bio: [
			'Shahee Ilyas is a Maldivian designer whose work combines graphic design, data visualisation and computer programming. He studied architecture at the University of Oregon (1996–1999) and received a Master of Arts in Media Design (Experimental Publishing) from the Piet Zwart Institute, Willem de Kooning Academy, in the Netherlands (2005–2007). He is a PhD candidate at RMIT University in Melbourne and a member of its Digital Ethnography Research Centre.',
			'His Thaana type work dates back to the late 1990s. He designed the Atharu typeface in 2000, Fiyuzu in 2002 and the first version of Fanara in 2008, the same year he published and presented research on Thaana typography. In 2020 he and Ayeshath Fadwa launched Thaana Type, a Maldivian foundry that releases free Thaana fonts under the SIL Open Font License. Fiyuzu was released there in 2020, and he co-designed Bolhu, Fanara, Fanara Golhi, Faagathi Dheli and Faagathi Neon. Fanara Golhi received a Special Mention at the 12th Granshan Type Design Competition (2021/22).',
			"His other work includes 'Flags by Colours' (2007), which shows the world's flags as pie charts of their colour proportions. It was shown at the IEEE Visualization 2007 art exhibition and reproduced in publications such as Data Flow (Die Gestalten, 2008). He has also made census and population visualisations for UNFPA Maldives and analyses of Maldivian election results, and with Ayeshath Fadwa he co-created Nakaiy Nevi (2012), an app for the traditional Maldivian nakaiy calendar."
		],
		excerpt:
			'Shahee Ilyas is a Maldivian designer whose work combines graphic design, data visualisation and programming. With Ayeshath Fadwa he founded Thaana Type, a foundry that publishes free Thaana fonts.',
		sources: [
			{
				title: 'About – Shahee Ilyas',
				url: 'https://shaheeilyas.com/about/'
			},
			{
				title: 'Shahee Ilyas – Monoskop',
				url: 'https://monoskop.org/Shahee_Ilyas'
			},
			{
				title: 'Thaana Type – Shahee Ilyas',
				url: 'https://shaheeilyas.com/project/thaana-type/'
			},
			{
				title: 'Flags By Colours – Shahee Ilyas',
				url: 'https://shaheeilyas.com/project/flags-by-colours/'
			},
			{
				title: 'Nakaiy Nevi – Shahee Ilyas',
				url: 'https://shaheeilyas.com/project/nakaiy-nevi/'
			},
			{
				title: 'Projects – Shahee Ilyas',
				url: 'https://shaheeilyas.com/project/'
			},
			{
				title: 'Thaana Type Foundry',
				url: 'https://thaana.com/'
			},
			{
				title: 'Fiyuzu – Thaana Type Foundry',
				url: 'https://thaana.com/fiyuzu/'
			}
		],
		page: true
	},
	{
		name: 'Vernon Adams',
		slug: 'vernon-adams',
		thaana: null,
		role: 'Type designer',
		born: '1967, England',
		knownFor: "Oswald and many other open-source typefaces on Google Fonts; KDE's Oxygen UI font",
		website: 'http://sansoxygen.com',
		links: [
			{
				label: 'Google Fonts designer page',
				url: 'https://fonts.google.com/?query=Vernon+Adams'
			},
			{
				label: 'Oswald on Google Fonts',
				url: 'https://fonts.google.com/specimen/Oswald'
			}
		],
		bio: [
			'Vernon Adams (1967–2016) was an English type designer who made open-source typefaces. He earned an MA in typeface design from the University of Reading, lived in San Clemente, California, and published his fonts through his New Typography site and Google Fonts, where 51 of his families are available. His work includes Oswald, a reworking of the Alternate Gothic style released in 2011, and Oxygen, the user-interface font of the KDE desktop.',
			'He was badly injured in a scooter accident in 2014 and died on 24 August 2016. MV Oswald pairs his Latin Oswald with Thaana glyphs added by Hassan Hameed in 2018.'
		],
		excerpt: 'Vernon Adams (1967–2016) was an English type designer who made open-source typefaces, including Oswald.',
		sources: [
			{
				title: 'Luc Devroye, Vernon Adams (Type Design Information Page)',
				url: 'https://luc.devroye.org/fonts-47641.html'
			},
			{
				title: 'Google Fonts: Vernon Adams designer bio',
				url: 'https://github.com/google/fonts/blob/main/catalog/designers/vernonadams/bio.html'
			},
			{
				title: 'Google Fonts: Oswald description',
				url: 'https://github.com/google/fonts/blob/main/ofl/oswald/DESCRIPTION.en_us.html'
			},
			{
				title: 'LWN.net: Vernon Adams obituary (2016)',
				url: 'https://lwn.net/Articles/697980/'
			},
			{
				title: 'KDE Dot: Remembering Vernon Adams (30 August 2016)',
				url: 'https://dot.kde.org/2016/08/30/remembering-vernon-adams/'
			},
			{
				title: 'Chapman University Leatherby Libraries: Display in honor of Vernon Adams (2018)',
				url: 'https://blogs.chapman.edu/library/2018/11/29/display-in-honor-of-vernon-adams-free-font-designer/'
			},
			{
				title:
					"MV Oswald font name table ('Copyright (c) 2010-13 by Vernon Adams. Thaana glyphs added by Dr Hassan Hameed, 28th August 2018')",
				url: 'https://fonts.mv'
			}
		],
		page: true
	},
	{
		name: 'Y.U.U',
		slug: 'y-u-u',
		thaana: null,
		role: 'Type designer (pseudonymous)',
		knownFor: 'YUU Thaana Kufi (2017), a Kufi-style Thaana font',
		website: 'https://github.com/miukumauku',
		links: [
			{
				label: 'GitHub',
				url: 'https://github.com/miukumauku'
			},
			{
				label: 'YUUThaanaKufi repository',
				url: 'https://github.com/miukumauku/YUUThaanaKufi'
			},
			{
				label: 'Behance',
				url: 'https://www.behance.net/yuuh1e81'
			}
		],
		bio: [
			'Y.U.U (@miukumauku_) is the designer of YUU Thaana Kufi, a Kufi-style Thaana font released in 2017 as an open-source font on GitHub. The same designer has published fonts and input tools for several other scripts, including a Mongolian Metafont, Tifinagh and toki pona fonts and an Emacs input method for Thaana.'
		],
		excerpt: 'Y.U.U (@miukumauku_) is the designer of YUU Thaana Kufi, a Kufi-style Thaana font released in 2017.',
		sources: [
			{
				title: 'GitHub – miukumauku/YUUThaanaKufi',
				url: 'https://github.com/miukumauku/YUUThaanaKufi'
			},
			{
				title: 'GitHub – miukumauku (profile and repositories)',
				url: 'https://github.com/miukumauku'
			},
			{
				title: 'miukumauku – Behance',
				url: 'https://www.behance.net/yuuh1e81'
			}
		],
		page: false
	},
	{
		name: 'Zillon',
		slug: 'zillon',
		thaana: null,
		role: 'Pseudonymous type designer (FontStruct), blogger and musician',
		knownFor:
			'About thirty experimental modular Thaana fonts built on FontStruct (MV Prathama, Kanafala, MV Hulhumale, MV Golhifoshi, MV Salhi and others), and the blog ThatMaldivesBlog about Dhivehi and Thaana',
		website: 'https://thatmaldivesblog.wordpress.com',
		links: [
			{
				label: 'ThatMaldivesBlog',
				url: 'https://thatmaldivesblog.wordpress.com'
			},
			{
				label: 'Thaana Fonts index (ThatMaldivesBlog)',
				url: 'https://thatmaldivesblog.wordpress.com/thaana-fonts/'
			},
			{
				label: 'FontStruct',
				url: 'https://fontstruct.com/fontstructors/1250314/zillon'
			},
			{
				label: 'X / Twitter (@Raajje_blog)',
				url: 'https://x.com/Raajje_blog'
			}
		],
		bio: [
			'Zillon is the pseudonym of a Maldivian type designer who publishes experimental Thaana fonts on FontStruct, a browser-based tool that builds fonts from modular pieces. The FontStruct account dates from September 2015 and had 31 shared fonts as of 2026. The designer also writes the blog ThatMaldivesBlog, started in April 2016, and its About page describes the author as a Maldivian who has lived abroad for a long time and would rather not say who they are.',
			'The first font announced on the blog was MV Prathama Tin (April 2016), a blocky serif Thaana design that drops most of the baseline stroke from which most Thaana letters are built. Kanafala followed later that month, and further fonts appeared over the next decade. They include MV Thaanarabi, MV Sishisozo, MV Lhaiy, MV Akson, MV Hulhumale, MV Dubai, MV Golhifoshi, MV Runa, MV Salhi, MV Binaa, MV Thinikaa and MV Dhidhavee. Most are offered on FontStruct under Creative Commons licences.',
			'The blog also covers the Dhivehi language and Maldivian society. It includes a long-running series of Dhivehi lessons, essays on etymology and vocabulary building, proposals for reforming Thaana, and urban-planning pieces under the title "Tharaggee". In 2020–2021 the author released an album, Sick City, under the same name, explaining that Zillon is the name they also use for fonts.'
		],
		excerpt:
			'Zillon is the pseudonym of a Maldivian type designer who publishes experimental Thaana fonts on FontStruct, a browser-based tool that builds fonts from modular pieces.',
		sources: [
			{
				title: 'ThatMaldivesBlog: About',
				url: 'https://thatmaldivesblog.wordpress.com/about/'
			},
			{
				title: 'ThatMaldivesBlog: Thaana Fonts',
				url: 'https://thatmaldivesblog.wordpress.com/thaana-fonts/'
			},
			{
				title: 'ThatMaldivesBlog: MV Prathama Tin (2016-04-03)',
				url: 'https://thatmaldivesblog.wordpress.com/2016/04/03/first-font/'
			},
			{
				title: 'ThatMaldivesBlog: MV Kanafala (2016-04-09)',
				url: 'https://thatmaldivesblog.wordpress.com/2016/04/09/new-font/'
			},
			{
				title: 'ThatMaldivesBlog Presents: Sick City (2020-04-13)',
				url: 'https://thatmaldivesblog.wordpress.com/2020/04/13/thatmaldivesblog-presents-sick-city/'
			},
			{
				title: 'ThatMaldivesBlog: MV Thinikaa (2026-02-20)',
				url: 'https://thatmaldivesblog.wordpress.com/2026/02/20/mv-thinikaa/'
			},
			{
				title: 'FontStruct: Zillon profile',
				url: 'https://fontstruct.com/fontstructors/1250314/zillon'
			},
			{
				title: 'FontStruct: MV Prathama Tin',
				url: 'https://fontstruct.com/fontstructions/show/1182340/prathama_tin'
			}
		],
		page: true
	}
];

/** Authors by their importance to Maldivian typography, most important first. Both
 *  sections of /authors follow it; anyone not listed goes last, alphabetically. */
export const AUTHOR_ORDER = [
	'Hassan Hameed',
	'Abdulla Waheed',
	'Ibrahim Yasir',
	'Shahee Ilyas',
	'Ayeshath Fadwa',
	'M.A. Gadir',
	'Hussain Niyaz',
	'Maldivian Internet Task Force',
	'Zillon',
	'Mohamed Mazeed',
	'David Williams',
	'Nexus Maldives Pvt. Ltd',
	'Hasan Shazil',
	'Adnan Ali',
	'Adam Zubin',
	'Loopcraft',
	'Mohamed Faiz',
	'Hussain Shameem',
	'Sappe',
	'Mohamed Ali',
	'Mohamed Azheel',
	'Ashrag Rasheed',
	'Y.U.U',
	'Vernon Adams'
];

export function byImportance(a: string, b: string): number {
	const rank = (n: string) => {
		const i = AUTHOR_ORDER.indexOf(n);
		return i === -1 ? AUTHOR_ORDER.length : i;
	};
	return rank(a) - rank(b) || a.localeCompare(b);
}

const byName = new Map(AUTHORS.map((a) => [a.name, a]));

export function authorBio(name: string): AuthorBio | undefined {
	return byName.get(name);
}

export function authorBySlug(slug: string): AuthorBio | undefined {
	return AUTHORS.find((a) => a.slug === slug);
}

/** Authors with their own page, for /authors and its prerendered entries. */
export const FEATURED_AUTHORS: AuthorBio[] = AUTHORS.filter((a) => a.page);

/** Where an author's name should take you: their page if they have one, else the filtered font list. */
export function authorHref(name: string): string {
	const bio = authorBio(name);
	return bio?.page ? `/authors/${bio.slug}` : `/?author=${encodeURIComponent(name)}`;
}

/** CSS font stack for Thaana names (Faruma, loaded from the site's own CSS API). */
export const THAANA_NAME_FONT = "'Faruma', 'MV Faseyha', 'Noto Sans Thaana', system-ui, sans-serif";
export const THAANA_NAME_CSS = '/css2?family=Faruma&display=swap';
