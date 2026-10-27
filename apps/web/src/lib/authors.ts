// Author bios (beta). Names match the credits in the catalogue (see authors() in catalog.ts).
// Authors with enough sourced information get a page at /authors/<slug>; the rest show a
// short note and an invitation to send what we're missing.

export interface AuthorBio {
	/** As credited in the catalogue. */
	name: string;
	slug: string;
	/** Name in Thaana, or null for studios and Latin-only names. */
	thaana: string | null;
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

export const AUTHORS: AuthorBio[] = [];

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
