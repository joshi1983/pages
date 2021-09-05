import { isContextValueStackLength } from './isContextValueStackLength.js';
import { isNoContextValueStackLength } from './isNoContextValueStackLength.js';

export function isValueStackLength(token) {
	return isContextValueStackLength(token) ||
	isNoContextValueStackLength(token, false);
};