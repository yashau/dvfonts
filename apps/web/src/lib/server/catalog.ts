import data from '#lib/data/catalog.json';
import type { Family } from '#lib/catalog.js';

export const catalog = data as unknown as {
	subsets: Record<'thaana' | 'latin', string>;
	families: Family[];
};

export const families: Family[] = catalog.families;

export function getFamily(id: string): Family | undefined {
	return families.find((f) => f.id === id);
}

/** Resolve a CSS-API family name: display name, id or any alias. */
export function findByName(name: string): Family | undefined {
	const n = name.trim().toLowerCase();
	return families.find((f) => f.name.toLowerCase() === n || f.id === n || f.aliases.some((a) => a.toLowerCase() === n));
}
