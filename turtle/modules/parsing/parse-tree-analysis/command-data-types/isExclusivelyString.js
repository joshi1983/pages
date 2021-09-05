import { DataTypes } from
'../../data-types/DataTypes.js';
import { isString } from './isString.js';

const names = new Set([
	'alphacolorstring', 'colorstring', 'cproc', 'string'
]);

// types should be an instance of DataTypes class equal to parsing typesStr.
export function isExclusivelyString(typesStr, types) {
	if (typesStr === undefined || typesStr === '')
		return false;

	if (isString(typesStr) || names.has(typesStr))
		return true;

	if (types === undefined)
		types = new DataTypes(typesStr);

	for (const type of types.types) {
		if (!names.has(type.name))
			return false;
	}
	return true;
};