import { defineComponent, h, withDirectives, type PropType } from 'vue';
import { isolateNumbers, resolveDirection } from '@yashau/thaana';
import { vThaana } from './directive.js';

function field(tag: 'input' | 'textarea', name: string) {
	return defineComponent({
		name,
		inheritAttrs: true,
		props: {
			modelValue: { type: String, default: '' },
			/** Latin keys type Thaana (Divehi Phonetic layout). */
			dv: { type: Boolean, default: true }
		},
		emits: ['update:modelValue'],
		setup(props, { emit }) {
			return () =>
				withDirectives(
					h(tag, {
						dir: resolveDirection(props.modelValue, null, props.dv ? 'rtl' : 'ltr'),
						lang: 'dv',
						value: props.modelValue,
						onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
					}),
					[[vThaana, { enabled: props.dv }]]
				);
		}
	});
}

/** <ThaanaInput v-model="name" />: an input that types Thaana, right-to-left. */
export const ThaanaInput: ReturnType<typeof field> = field('input', 'ThaanaInput');
/** <ThaanaTextarea v-model="text" />: a textarea that types Thaana, right-to-left. */
export const ThaanaTextarea: ReturnType<typeof field> = field('textarea', 'ThaanaTextarea');

/**
 * <ThaanaText :text="..." as="p" />: display Thaana correctly. Right-to-left
 * when it contains Thaana (even if it starts with a Latin word), lang="dv",
 * and numbers, phone numbers and percentages isolated so "-5" or
 * "+960 333-1234" don't scramble. Display only; the stored text is unchanged.
 */
export const ThaanaText = defineComponent({
	name: 'ThaanaText',
	props: {
		text: { type: String, required: true },
		as: { type: String, default: 'span' },
		dir: { type: String as PropType<'rtl' | 'ltr' | undefined>, default: undefined }
	},
	setup(props) {
		return () =>
			h(
				props.as,
				{ dir: resolveDirection(props.text, props.dir, 'rtl'), lang: 'dv', style: { unicodeBidi: 'isolate' } },
				isolateNumbers(props.text)
			);
	}
});
