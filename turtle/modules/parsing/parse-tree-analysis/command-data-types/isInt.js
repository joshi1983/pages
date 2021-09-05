import { DataTypes } from
'../../data-types/DataTypes.js';

const nonIntTypes = new Set([
	null, 'num', 'num(finite)', 'num(unfinite)'
]);
const intTypes = new Set([
	'int', 'int(max=0)', 'int(min=0)'
]);

export function isInt(s) {
	if (nonIntTypes.has(s) ||
	!s.startsWith('int'))
		return false;

	if (intTypes.has(s))
		return true;

	for (const type of DataTypes.typesArray) {
		if (type.name !== 'int' && s.indexOf(type.name) !== -1)
			return false;
	}
	const types = new DataTypes(s);
	for (const type of types.types) {
		if (type.name !== 'int')
			return false;
	}
	return true;
};