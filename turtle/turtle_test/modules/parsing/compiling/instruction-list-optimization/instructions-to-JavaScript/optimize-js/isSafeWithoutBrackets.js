import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

const valTypesSafeWithoutBrackets = new Set([
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.UNARY_OPERATOR
]);

export function isSafeWithoutBrackets(valToken) {
	if (valToken.children.length === 0)
		return true;
	return valTypesSafeWithoutBrackets.has(valToken.type);
};