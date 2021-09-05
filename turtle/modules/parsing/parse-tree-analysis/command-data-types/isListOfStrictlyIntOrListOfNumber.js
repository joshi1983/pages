import { getSubtypesFromListTypes } from
'./getSubtypesFromListTypes.js';
import { isNum } from
'./isNum.js';

const listOfNumTypes = new Set([
'alphacolorlist', 'colorlist',
'list<int>', 'list<num>', 'list<num(finite)>'
]);

export function isListOfStrictlyIntOrListOfNumber(types) {
	if (listOfNumTypes.has(types))
		return true;

	const subtypes = getSubtypesFromListTypes(types, 'string');
	if (subtypes === 'string')
		return false;

	return isNum(subtypes);
};