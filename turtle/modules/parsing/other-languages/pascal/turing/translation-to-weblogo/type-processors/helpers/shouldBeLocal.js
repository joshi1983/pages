import { getClosestOfTypes } from
'../../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function shouldBeLocal(token) {
	const f = getClosestOfTypes(token, [
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE]);
	if (f === null)
		return false;
	
	// FIXME: if variableName is not a parameter and not declared, should it be global?

	return true;
};