import { describe, expect, it } from 'vitest';
import {
	detectDirection,
	fontStack,
	hasRtl,
	isMixedScript,
	isolateNumbers,
	normalizePunctuation,
	repairPdfText,
	resolveDirection,
	stripBidiControls,
	LRI,
	PDI
} from '../src/index.js';

const iso = (s: string) => `${LRI}${s}${PDI}`;

describe('script detection', () => {
	it('classifies scripts like rihaPDF', () => {
		expect(hasRtl('hello')).toBe(false);
		expect(hasRtl('ހެނދުނު')).toBe(true);
		expect(isMixedScript('ދިވެހި 123')).toBe(false); // digits are neutral
		expect(isMixedScript('Hello ދިވެހި')).toBe(true);
	});
	it('resolves direction: explicit wins, any RTL letter means RTL', () => {
		expect(resolveDirection('Apple ގެ ފޯނު')).toBe('rtl');
		expect(detectDirection('Apple ގެ ފޯނު')).toBe('ltr'); // what dir="auto" would do
		expect(resolveDirection('ދިވެހި', 'ltr')).toBe('ltr');
		expect(resolveDirection('123')).toBe('ltr');
		expect(resolveDirection('123', null, 'rtl')).toBe('rtl');
		expect(resolveDirection('(2026).', null, 'rtl')).toBe('rtl');
		expect(resolveDirection('Hello (2026).', null, 'rtl')).toBe('ltr');
	});
});

describe('isolateNumbers', () => {
	it('matches rihaPDF protectRtlNumericMarkers', () => {
		expect(isolateNumbers('ހެނދުނު 9:00 test')).toBe(`ހެނދުނު ${iso('9:00')} test`);
		expect(isolateNumbers('ހެނދުނު 9:00 test', false)).toBe('ހެނދުނު 9:00 test');
	});
	it('keeps brackets outside the isolate', () => {
		expect(isolateNumbers('(2019) ވަނަ')).toBe(`(${iso('2019')}) ވަނަ`);
	});
	it('covers the cases rihaPDF missed', () => {
		expect(isolateNumbers('ފޯނު +960 333-1234')).toBe(`ފޯނު ${iso('+960 333-1234')}`);
		expect(isolateNumbers('ރ. 1,000 ގެ')).toBe(`ރ. ${iso('1,000')} ގެ`);
		expect(isolateNumbers('ދަށް -5 ޑިގްރީ')).toBe(`ދަށް ${iso('-5')} ޑިގްރީ`);
		expect(isolateNumbers('50% އަށް')).toBe(`${iso('50%')} އަށް`);
		expect(isolateNumbers('ހަތަރު 4.')).toBe(`ހަތަރު ${iso('4')}.`); // sentence full stop stays outside
	});
	it('round-trips through stripBidiControls', () => {
		const t = 'ފޯނު +960 333-1234، 9:00 ގައި';
		expect(stripBidiControls(isolateNumbers(t))).toBe(t);
		expect(stripBidiControls('a‏b‫c؜d')).toBe('abcd');
	});
});

describe('normalizePunctuation (rihaPDF cases)', () => {
	it('tightens punctuation gaps without eating the following space', () => {
		expect(normalizePunctuation('ބަސް ، ބުދަ ؛ އެއް ؟ ނޫން !')).toBe('ބަސް، ބުދަ؛ އެއް؟ ނޫން!');
	});
	it('tightens bracket interiors while preserving the space before an opener', () => {
		expect(normalizePunctuation('ދުވަސް ( ބުރުނު ) [ 8 ]')).toBe('ދުވަސް (ބުރުނު) [8]');
	});
	it('turns Latin , ; ? after Thaana into Dhivehi punctuation', () => {
		expect(normalizePunctuation('ބަސް , ބުދަ?')).toBe('ބަސް، ބުދަ؟');
		expect(normalizePunctuation('ބަސް , ބުދަ?', { arabicPunctuation: false })).toBe('ބަސް, ބުދަ?');
	});
	it('leaves Latin text alone', () => {
		expect(normalizePunctuation('Hello , world ( x )')).toBe('Hello , world ( x )');
	});
});

describe('repairPdfText (rihaPDF displayTextForEditor cases)', () => {
	it('keeps non-Thaana text unchanged', () => {
		expect(repairPdfText('morning 00:9, test')).toBe('morning 00:9, test');
		expect(repairPdfText('57-T/IU/2026/15')).toBe('57-T/IU/2026/15');
	});
	it('reorders extracted slash dates and colon times', () => {
		expect(repairPdfText('ހެނދުނު 00:9 ގައި')).toBe('ހެނދުނު 9:00 ގައި');
		expect(repairPdfText('ހެނދުނު 00: 9 ގައި')).toBe('ހެނދުނު 9:00 ގައި');
		expect(repairPdfText('ތާރީޚް 2026/1/14')).toBe('ތާރީޚް 14/1/2026');
	});
	it('tightens punctuation and brackets', () => {
		expect(repairPdfText('ބަސް ، ބުދަ ؛ އެއް ؟ ނޫން !')).toBe('ބަސް، ބުދަ؛ އެއް؟ ނޫން!');
		expect(repairPdfText('ދުވަސް ( ބުރުނު ) [ 8 ]')).toBe('ދުވަސް (ބުރުނު) [8]');
	});
	it('moves list and section markers back', () => {
		expect(repairPdfText('1 ބައި.')).toBe('.1 ބައި');
		expect(repairPdfText('.12 ބައި')).toBe('2-1 ބައި');
	});
});

describe('fontStack', () => {
	it('puts Latin and system Thaana fallbacks after the family', () => {
		expect(fontStack('Faruma')).toBe("'Faruma', system-ui, 'Noto Sans Thaana', 'MV Boli', sans-serif");
		expect(fontStack('MV Faseyha', { latin: 'Inter' })).toBe(
			"'MV Faseyha', 'Inter', 'Noto Sans Thaana', 'MV Boli', sans-serif"
		);
	});
});
