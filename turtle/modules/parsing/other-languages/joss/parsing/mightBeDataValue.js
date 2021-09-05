import { getJossName } from
'../translation-to-weblogo/type-processors/function-calls/getJossName.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const dataValueTypes = new Set([
	ParseTreeTokenType.ABSOLUTE_EXPRESSION,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function mightBeDataValue(token) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const name = getJossName(token);
		if (name !== undefined) {
			const info = MigrationInfo.getFunctionInfo(name);
			if (info !== undefined && info.returnTypes === null)
				return false;
		}
	}
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.parentNode.type === ParseTreeTokenType.FUNCTION_CALL)
		return false;
		// For example, the f in f(123) can't evaluate to a data value.
		// The parent(a function call) might evaluate to a data value, though.

	if (!dataValueTypes.has(token.type))
		return false;
	return true;
};