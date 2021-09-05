import { DataTypes } from
'../../data-types/DataTypes.js';

export function hasMaxValue(types) {
	if (typeof types !== 'string' ||
	types.indexOf('max=') === -1 ||
	types.startsWith('int|'))
		return false;

	if (types.indexOf('(max=') === -1 &&
	types.indexOf(',max=') === -1)
		return false;

	// It should be rare to reach this point.
	// It is difficult to avoid parsing the data types string now, though.
	// Let's do the slow work of parsing types to get an accurate result.
	const dTypes = new DataTypes(types);
	for (const type of dTypes.types) {
		if (type.name === 'int')
			return false;
		else if (type.name === 'num' &&
		type.max < Infinity) {
			return true;
		}
	}
	return false;
};