// Single-file browser module served at dvfonts.yashau.com/thaana.js:
// importing it attaches the keyboard to [data-thaana] fields and exposes the API.
import { startAutoAttach } from './auto.js';

startAutoAttach();

export * from './index.js';
