import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export const binaryPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function isGoodBinaryPrevious(token) {
	if (!binaryPreviousTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER ||
	token.type === ParseTreeTokenType.FUNCTION_CALL) {
		if (token.parentNode.val === '.')
			return false;
	}
	return true;
};

export function getUnaryBinaryPrev(token) {
	let parent = token.parentNode;
	const index = parent.children.indexOf(token);
	if (index === 0)
		return;
	let t = parent.children[index - 1];
	while (t.children.length !== 0 && !isGoodBinaryPrevious(t))
		t = t.children[t.children.length - 1];
	parent = t.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent.children.length === 2)
		return;
	return t;
};