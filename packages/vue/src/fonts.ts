import { onMounted, ref, type Ref } from 'vue';
import { loadFonts, type FontCssOptions } from '@yashau/thaana';

/**
 * Load a Dhivehi font from dvfonts; `ready` turns true once it can be drawn.
 *
 *   const ready = useDhivehiFont('Faruma');
 */
export function useDhivehiFont(family: string, weights?: number[], options?: FontCssOptions): Ref<boolean> {
	const ready = ref(false);
	onMounted(() => {
		loadFonts({ family, weights }, options).then(
			() => (ready.value = true),
			() => (ready.value = false)
		);
	});
	return ready;
}
