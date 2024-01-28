import { containsTypeName } from './containsTypeName.js';
import { isNum } from './isNum.js';

export function intersectsWithNum(types) {
	return isNum(types) ||
		containsTypeName(types, 'num') ||
		containsTypeName(types, 'int') ||
		containsTypeName(types, 'color') ||
		containsTypeName(types, 'alphacolor');
};