/** Sample sentences that use all 24 native Thaana letters. */
export const PANGRAMS: readonly string[] = [
	'ޗާލު ޒުވާން ކުއްޖާ، ފޮށިން ޕެކެޓެއް ކަނޑައި، ޏަމްޏަމް ގަހުގައި އިން ބުޅަލަށް މަސްދީ، ރީތި ލަވައެއް ކިޔައިދިނެވެ.',
	'ޏ. ފުވައްމުލަކުގެ ޒުވާނުން ޗުއްޓީގައި ޖުމްހޫރީ ޕާކުގައި ފުޓުބޯޅަ ކުޅޭއިރު، ޑޮކްޓަރު ހުރީ ޔާރުންނާއެކު ސައިބޯމުން ދޫނިތަކަށް ބަލަބަލާށެވެ.'
];

/** Uses 12 of the 14 Arabic-derived letters (ޜ and ޥ have no common words). */
export const ARABIC_LETTERS_SAMPLE = 'ރަމަޟާން މަހުގެ ޚާއްޞަ ޘަޤާފަތާއި ޝަރީޢަތުގެ ޙަޤީޤަތް ޙިފްޡުކޮށް ޛިކުރުކުރުމަކީ ބަޣާވާތެއް ނޫނެވެ.';

const range = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => String.fromCodePoint(from + i));

/** The 24 native letters, in alphabet order. */
export const LETTERS: string[] = range(0x0780, 0x0798);
/** The 14 letters added for Arabic loanwords. */
export const ARABIC_LETTERS: string[] = range(0x0798, 0x07a6);
/** Vowel marks (fili), including sukun. */
export const FILI: string[] = range(0x07a6, 0x07b1);
