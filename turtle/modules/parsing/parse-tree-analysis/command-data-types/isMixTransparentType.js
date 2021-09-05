import { containsTypeName } from './containsTypeName.js';

const mixTransparentTypes = new Set(['transparent', 'string|transparent', 
		'alphacolorstring|transparent', 'colorstring|transparent']);

/*
Checks if the corresponding values are a superset of 'transparent'

The Set above is checked only because it can be faster if that returns true than running containsTypeName.
*/
export function isMixTransparentType(types) {
	return mixTransparentTypes.has(types) ||
		containsTypeName(types, 'transparent');
};