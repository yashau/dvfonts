import { forwardRef, useMemo, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { resolveDirection } from '@yashau/thaana';
import { useThaanaKeyboard, mergeRefs } from './keyboard.js';

export interface ThaanaFieldProps {
	/** Latin keys type Thaana (Divehi Phonetic layout). Default: true. */
	dv?: boolean;
}

export type ThaanaInputProps = InputHTMLAttributes<HTMLInputElement> & ThaanaFieldProps;
export type ThaanaTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & ThaanaFieldProps;

/** <input> that types Thaana, right-to-left, with autocorrect off. */
export const ThaanaInput: React.ForwardRefExoticComponent<ThaanaInputProps & React.RefAttributes<HTMLInputElement>> =
	forwardRef<HTMLInputElement, ThaanaInputProps>(function ThaanaInput({ dv = true, style, ...props }, ref) {
		const kb = useThaanaKeyboard<HTMLInputElement>({ enabled: dv });
		const merged = useMemo(() => mergeRefs(ref, kb), [ref, kb]);
		return (
			<input
				dir={resolveDirection(String(props.value ?? props.defaultValue ?? ''), null, 'rtl')}
				lang="dv"
				{...props}
				ref={merged}
				style={style}
			/>
		);
	});

/** <textarea> that types Thaana, right-to-left, with autocorrect off. */
export const ThaanaTextarea: React.ForwardRefExoticComponent<
	ThaanaTextareaProps & React.RefAttributes<HTMLTextAreaElement>
> = forwardRef<HTMLTextAreaElement, ThaanaTextareaProps>(function ThaanaTextarea({ dv = true, style, ...props }, ref) {
	const kb = useThaanaKeyboard<HTMLTextAreaElement>({ enabled: dv });
	const merged = useMemo(() => mergeRefs(ref, kb), [ref, kb]);
	return (
		<textarea
			dir={resolveDirection(String(props.value ?? props.defaultValue ?? ''), null, 'rtl')}
			lang="dv"
			{...props}
			ref={merged}
			style={style}
		/>
	);
});
