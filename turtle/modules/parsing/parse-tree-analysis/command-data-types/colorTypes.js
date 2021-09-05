import { isNum } from './isNum.js';

const colorTypes = new Set(['color', 'colorstring', 'colorlist']);

export function isStrictlyColor(types) {
	return colorTypes.has(types);
};

export function isStrictlyColorOrNum(types) {
	return isStrictlyColor(types) || isNum(types);
};