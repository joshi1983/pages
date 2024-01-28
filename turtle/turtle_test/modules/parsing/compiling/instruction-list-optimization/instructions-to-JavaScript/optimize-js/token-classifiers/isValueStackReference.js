import { isContextValueStackReference } from './isContextValueStackReference.js';
import { isNoContextValueStackReference } from './isNoContextValueStackReference.js';

export function isValueStackReference(token) {
	return isContextValueStackReference(token) ||
	isNoContextValueStackReference(token);
};