import type { App } from 'vue';
import { vThaana } from './directive.js';
import { ThaanaInput, ThaanaTextarea, ThaanaText } from './components.js';

export { vThaana, type ThaanaDirectiveOptions } from './directive.js';
export { ThaanaInput, ThaanaTextarea, ThaanaText } from './components.js';
export { useDhivehiFont } from './fonts.js';
// The framework-agnostic helpers, so one install is enough.
export * from '@yashau/thaana';

/** app.use(ThaanaPlugin) registers v-thaana, <ThaanaInput>, <ThaanaTextarea> and <ThaanaText> globally. */
export const ThaanaPlugin: { install(app: App): void } = {
	install(app) {
		app.directive('thaana', vThaana);
		app.component('ThaanaInput', ThaanaInput);
		app.component('ThaanaTextarea', ThaanaTextarea);
		app.component('ThaanaText', ThaanaText);
	}
};
