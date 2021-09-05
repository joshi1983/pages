import { isContextValueStackPush } from './isContextValueStackPush.js';
import { isNoContextValueStackPush } from './isNoContextValueStackPush.js';

export function isValueStackPush(token) {
	return isContextValueStackPush(token) ||
	isNoContextValueStackPush(token, false);
};