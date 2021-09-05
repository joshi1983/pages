import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const nonDataTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.IMPORT,
	ParseTreeTokenType.IMPORT_PACKAGE_LIST,
	ParseTreeTokenType.PACKAGE,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.SWITCH_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function isPossibleData(token) {
	if (nonDataTokenTypes.has(token.type))
		return false;
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		if (parent.type === ParseTreeTokenType.FUNC ||
		parent.type === ParseTreeTokenType.FUNC_CALL)
			return false;
	}
	return true;
};