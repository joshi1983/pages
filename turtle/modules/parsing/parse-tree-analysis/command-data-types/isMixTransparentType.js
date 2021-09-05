import { containsTypeName } from './containsTypeName.js';

const mixTransparentTypes = new Set(['transparent', 'string|transparent', 
		'alphacolorstring|transparent', 'colorstring|transparent']);

export function isMixTransparentType(types) {
	return mixTransparentTypes.has(types) ||
		containsTypeName(types, 'transparent');
};