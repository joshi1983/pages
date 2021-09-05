import { DataTypes } from
'../../data-types/DataTypes.js';

const mightBeStringTypeNames = new Set([
	'alphacolor', 'alphacolorstring',
	'color', 'colorstring', 'string'
]);

export function isNotIntersectingString(typesStr, types) {
	if (mightBeStringTypeNames.has(typesStr))
		return false;

	if (types === undefined)
		types = new DataTypes(typesStr);

	for (const type of types.types) {
		if (mightBeStringTypeNames.has(type.name))
			return false;
	}
	return true;
};