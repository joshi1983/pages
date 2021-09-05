import { DataTypes } from
'../../data-types/DataTypes.js';

const finiteVals = new Set([
	'int', 'num(finite)'
]);
const unfiniteVals = new Set([
	null, 'num', 'num(unfinite)'
]);

export function isFiniteNum(type) {
	if (finiteVals.has(type))
		return true;

	if (unfiniteVals.has(type) ||
	type.indexOf('num(unfinite') !== -1 ||
	(!type.startsWith('num') && !type.startsWith('int')))
		return false;

	const types = new DataTypes(type);
	for (const singleType of types.types) {
		const typeName = singleType.name;
		if (typeName !== 'num' && typeName !== 'int')
			return false;
		if (typeName === 'num') {
			if (singleType.isUnfiniteOnly)
				return false;
			if (!singleType.isFiniteOnly && 
			(singleType.min === -Infinity || singleType.max === Infinity))
				return false;
		}
	}

	return true;
};