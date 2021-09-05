import { getClosestOfTypes } from
'../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getMakeCommandNameForToken(token) {
	const definition = getClosestOfTypes(token, [
		ParseTreeTokenType.DEF,
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.SUB
	]);
	if (definition === null)
		return 'make';
	else
		return 'localmake';
};