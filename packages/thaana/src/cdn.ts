// Single-file browser module served at fonts.mv/thaana.js:
// importing it attaches the keyboard to [data-thaana] fields and exposes the API.
import { startAutoAttach } from './auto.js';

startAutoAttach();

export * from './index.js';
