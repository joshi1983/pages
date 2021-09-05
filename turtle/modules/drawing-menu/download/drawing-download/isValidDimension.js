import { sanitizeDimension } from './sanitizeDimension.js';

export function isValidDimension(s) {
	return !isNaN(sanitizeDimension(s));
};