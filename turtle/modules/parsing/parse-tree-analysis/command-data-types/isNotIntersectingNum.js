import { DataTypes } from
'../../data-types/DataTypes.js';

const mightBeNumTypeNames = new Set([
	'alphacolor', 'color', 'int', 'num'
]);

export function isNotIntersectingNum(typesStr, types) {
	if (mightBeNumTypeNames.has(typesStr))
		return false;

	if (types === undefined)
		types = new DataTypes(typesStr);

	for (const type of types.types) {
		if (mightBeNumTypeNames.has(type.name))
			return false;
	}
	return true;
};