import { getClosestOfType } from '../../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
In code like: context.make("x", 4)
The input would be the token representing the string literal "x".
The output would be the FUNCTION_CALL token parenting the context and argument list.
*/
export function getVariableWriteRootToken(stringLiteralToken) {
	return getClosestOfType(stringLiteralToken, ParseTreeTokenType.FUNCTION_CALL);
};