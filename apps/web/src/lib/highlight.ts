// Syntax highlighting for code blocks, loaded in the browser after the page
// renders (the prerendered HTML keeps the plain code). Shiki with the
// JavaScript regex engine and only the grammars and themes the site uses.
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export type CodeLang = 'html' | 'css' | 'javascript' | 'jsx' | 'svelte' | 'vue' | 'bash';

let highlighter: Promise<HighlighterCore> | undefined;

function load(): Promise<HighlighterCore> {
	highlighter ??= createHighlighterCore({
		themes: [import('shiki/themes/github-light-default.mjs'), import('shiki/themes/github-dark-default.mjs')],
		langs: [
			import('shiki/langs/html.mjs'),
			import('shiki/langs/css.mjs'),
			import('shiki/langs/javascript.mjs'),
			import('shiki/langs/jsx.mjs'),
			import('shiki/langs/svelte.mjs'),
			import('shiki/langs/vue.mjs'),
			import('shiki/langs/bash.mjs')
		],
		engine: createJavaScriptRegexEngine()
	});
	return highlighter;
}

/** Highlighted HTML for `code`. Both themes are emitted as CSS variables
 *  (--shiki-light / --shiki-dark); layout.css picks one for the current theme. */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
	return (await load()).codeToHtml(code, {
		lang,
		themes: { light: 'github-light-default', dark: 'github-dark-default' },
		defaultColor: false
	});
}
