// The docs area: its pages and their sections, in reading order. Section ids must match the
// ids on each page; the side navigation links to them and highlights the one being read.
export interface DocsPage {
	href: string;
	title: string;
	sections: { id: string; label: string }[];
}

export const DOCS: DocsPage[] = [
	{
		href: '/docs',
		title: 'Getting started',
		sections: [
			{ id: 'embed', label: 'Embed a font' },
			{ id: 'keyboard', label: 'Thaana keyboard' },
			{ id: 'packages', label: 'Packages' },
			{ id: 'same-size', label: 'Same size for every font' },
			{ id: 'helpers', label: 'Helpers' },
			{ id: 'self-hosting', label: 'Self-hosting' },
			{ id: 'data', label: 'For tools and agents' }
		]
	},
	{
		href: '/docs/thaana',
		title: 'Displaying Thaana well',
		sections: [
			{ id: 'direction', label: 'Direction and language' },
			{ id: 'user-content', label: 'Text people type' },
			{ id: 'numbers', label: 'Numbers and phone numbers' },
			{ id: 'brackets', label: 'Brackets' },
			{ id: 'punctuation', label: 'Punctuation' },
			{ id: 'line-height', label: 'Line height' },
			{ id: 'fallback', label: 'Latin fallback' },
			{ id: 'italics', label: 'No italics' },
			{ id: 'inputs', label: 'Inputs' },
			{ id: 'canvas', label: 'Canvas and SVG' },
			{ id: 'old-text', label: 'Old fonts and PDFs' },
			{ id: 'pdf', label: 'Generating PDFs' },
			{ id: 'storing', label: 'Storing and searching' }
		]
	},
	{
		href: '/docs/tools',
		title: 'Tools',
		sections: [{ id: 'convert', label: 'Convert old Thaana text' }]
	}
];
