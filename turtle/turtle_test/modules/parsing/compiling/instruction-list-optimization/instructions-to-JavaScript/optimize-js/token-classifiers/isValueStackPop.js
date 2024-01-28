import { isContextValueStackPop } from './isContextValueStackPop.js';
import { isNoContextValueStackPop } from './isNoContextValueStackPop.js';

export function isValueStackPop(token) {
	return isNoContextValueStackPop(token) ||
		isContextValueStackPop(token);
};