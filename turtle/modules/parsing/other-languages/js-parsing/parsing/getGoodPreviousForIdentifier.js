import { declaringTypes } from './declaringTypes.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FINALLY,
	ParseTreeTokenType.FROM,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
]);

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DOT
]);

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.DOT &&
	token.children.length >= 1)
		return false;
	if (goodPreviousTypes.has(token.type))
		return true;
	if (badPreviousTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.NEW &&
	token.children.length !== 0 &&
	token.parentNode !== null &&
	token.parentNode.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	if ((token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) &&
	token.children.length === 2)
		return false;
	if (declaringTypes.has(token.type) && token.children.length !== 0)
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
	if ((token.type === ParseTreeTokenType.STATIC ||
	token.type === ParseTreeTokenType.AWAIT) &&
	token.children.length !== 0)
		return false;
	return true;
}

export function getGoodPreviousForIdentifier(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
};