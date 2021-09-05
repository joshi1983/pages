import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const terminatingTypes = new Set([
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SELECT,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.END_TYPE,
]);

export function mightBeEnding(token) {
	if (token.type === ParseTreeTokenType.END ||
	token.type === ParseTreeTokenType.RETURN)
		return true;
	if (terminatingTypes.has(token.type))
		return false;
	for (const child of token.children) {
		if (mightBeEnding(child))
			return true;
	}
	return false;
};