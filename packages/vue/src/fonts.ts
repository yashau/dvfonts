import { onMounted, ref, type Ref } from 'vue';
import { loadFonts, type FontCssOptions, type FontRequest } from '@yashau/thaana';

/** CSS options, plus `files` (your own copies, by weight) and `sizeAdjust` to skip dvfonts' hosting. */
export type DhivehiFontOptions = FontCssOptions & Pick<FontRequest, 'files' | 'sizeAdjust'>;

/**
 * Load a Dhivehi font from dvfonts, or from your own files; `ready` turns true once it can be drawn.
 *
 *   const ready = useDhivehiFont('Faruma');
 *   const ready = useDhivehiFont('Faruma', undefined, { files: { 400: '/fonts/faruma-400.woff2' } });
 */
export function useDhivehiFont(family: string, weights?: number[], options?: DhivehiFontOptions): Ref<boolean> {
	const ready = ref(false);
	onMounted(() => {
		const { files, sizeAdjust, ...css } = options ?? {};
		loadFonts({ family, weights, files, sizeAdjust }, css).then(
			() => (ready.value = true),
			() => (ready.value = false)
		);
	});
	return ready;
}
