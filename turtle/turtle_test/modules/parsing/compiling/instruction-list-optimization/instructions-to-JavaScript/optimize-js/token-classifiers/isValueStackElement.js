import { isContextValueStackElement } from './isContextValueStackElement.js';
import { isNoContextValueStackElement } from './isNoContextValueStackElement.js';

export function isValueStackElement(token) {
	return isNoContextValueStackElement(token) ||
	isContextValueStackElement(token);
};