import { getClosestOfTypes } from
'../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getContainingFunction(token) {
	return getClosestOfTypes(token, [
		ParseTreeTokenType.DEF,
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.SUB
	]);
};