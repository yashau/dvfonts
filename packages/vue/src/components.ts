import { defineComponent, h, withDirectives, type PropType } from 'vue';
import { vThaana } from './directive.js';

function field(tag: 'input' | 'textarea', name: string) {
	return defineComponent({
		name,
		inheritAttrs: true,
		props: {
			modelValue: { type: String, default: '' },
			/** Latin keys type Thaana (Divehi Phonetic layout). */
			dv: { type: Boolean, default: true },
			/** Swap brackets like Microsoft's Divehi Phonetic layout. */
			swapBrackets: { type: Boolean as PropType<boolean>, default: false }
		},
		emits: ['update:modelValue'],
		setup(props, { emit }) {
			return () =>
				withDirectives(
					h(tag, {
						dir: 'rtl',
						lang: 'dv',
						style: { unicodeBidi: 'plaintext' },
						value: props.modelValue,
						onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
					}),
					[[vThaana, { enabled: props.dv, swapBrackets: props.swapBrackets }]]
				);
		}
	});
}

/** <ThaanaInput v-model="name" />: an input that types Thaana, right-to-left. */
export const ThaanaInput: ReturnType<typeof field> = field('input', 'ThaanaInput');
/** <ThaanaTextarea v-model="text" />: a textarea that types Thaana, right-to-left. */
export const ThaanaTextarea: ReturnType<typeof field> = field('textarea', 'ThaanaTextarea');
