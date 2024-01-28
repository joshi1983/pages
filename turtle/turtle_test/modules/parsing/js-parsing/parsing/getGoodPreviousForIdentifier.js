import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FROM,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
]);

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DOT
]);

function isGoodPrevious(token) {
	if (goodPreviousTypes.has(token.type))
		return true;
	if (badPreviousTypes.has(token.type))
		return false;
	if ((token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) &&
	token.children.length === 2)
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK) {
		if (token.children[0].type === ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		!endsWithCurlyRightBracket(token))
			return true;
		if (token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		token.children.length === 1)
			return false;
		if (token.parentNode.type === ParseTreeTokenType.FUNCTION ||
		token.parentNode.type === ParseTreeTokenType.STATIC)
			return false;
	}
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	endsWithClosingCurvedBracket(token))
		return false;
	if (token.type === ParseTreeTokenType.STATIC &&
	token.children.length !== 0)
		return false;
	return true;
}

export function getGoodPreviousForIdentifier(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
};