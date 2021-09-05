import { DataTypes } from
'../../data-types/DataTypes.js';
import { getSubtypesFromListTypes } from
'./getSubtypesFromListTypes.js';
import { hasMinValue } from
'./hasMinValue.js';
import { isFiniteNum } from
'./isFiniteNum.js';
import { isInt } from
'./isInt.js';

function getMinSingle(types) {
	let result = Infinity;
	types = new DataTypes(types).types;
	if (types.size === 0)
		return -Infinity;

	for (const type of types) {
		if (typeof type.min === 'number')
			result = Math.min(result, type.min);
	}
	return result;
}

function getMin(types1, types2) {
	return Math.min(getMinSingle(types1), getMinSingle(types2));
}

export function getDotReturnTypes(listTypes1, listTypes2) {
	const subtypes1 = getSubtypesFromListTypes(listTypes1);
	const subtypes2 = getSubtypesFromListTypes(listTypes2);
	if (subtypes1 === 'num' || subtypes2 === 'num')
		return 'num';

	let min = -Infinity;
	if (isInt(subtypes1) && isInt(subtypes2)) {
		if (hasMinValue(subtypes1) && hasMinValue(subtypes2)) {
			min = getMin(subtypes1, subtypes2);
			if (min >= 0)
				return 'int(min=0)';
		}
		return 'int';
	}
	else if (hasMinValue(subtypes1) && hasMinValue(subtypes2)) {
		min = getMin(subtypes1, subtypes2);
	}

	if (isFiniteNum(subtypes1) && isFiniteNum(subtypes2)) {
		if (min >= 0)
			return 'num(finite,min=0)';
		else
			return 'num(finite)';
	}
	else if (min >= 0)
		return 'num(min=0)';
	else
		return 'num';
};