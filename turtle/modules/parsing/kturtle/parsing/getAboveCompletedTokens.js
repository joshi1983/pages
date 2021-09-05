import { getArgumentCount } from './getArgumentCount.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.VARIABLE_REFERENCE
]);

function isComplete(token, procedures) {
	if (!(procedures instanceof Map))
		throw new Error(`procedures expected to be a Map but got ${procedures}`);
	if (noChildTypes.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return token.children.length === 2;
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length > 2)
		return token.children[token.children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	if (token.type === ParseTreeTokenType.IF &&
	token.children.length < 2)
		return false;
	if (token.type === ParseTreeTokenType.WHILE ||
	token.type === ParseTreeTokenType.FOR ||
	token.type === ParseTreeTokenType.REPEAT)
		return token.children.length === 2;
	if (token.type === ParseTreeTokenType.CODE_BLOCK)
		return token.children[token.children.length - 1].type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
	if (token.type === ParseTreeTokenType.LEARN)
		return token.children.length === 3;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const len = getArgumentCount(token, procedures);
		const nonCommaTokens = token.children.filter(t => t.type !== ParseTreeTokenType.COMMA);
		return nonCommaTokens.length >= len;
	}
	return false;
}

export function getAboveCompletedTokens(token, procedures) {
	if (!(procedures instanceof Map))
		throw new Error(`Expected procedures to be a Map but got ${procedures}`);
	while (token.parentNode !== null && isComplete(token, procedures))
		token = token.parentNode;
	return token;
};