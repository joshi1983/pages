import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (!goodPreviousTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK ||
	token.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
		if (token.children.length !== 0 && (
		token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET ||
		endsWithCurlyRightBracket(token)))
			return false;
		return token.children.length === 0 || token.children[0].type === ParseTreeTokenType.CURLY_LEFT_BRACKET;
	}
	if (token.type === ParseTreeTokenType.ELSE_IF)
		return token.children.length === 0;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processIf(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken))
		return;
	if (previousToken.type === ParseTreeTokenType.ELSE)
		previousToken.type = ParseTreeTokenType.ELSE_IF;
	if (previousToken.type === ParseTreeTokenType.IMPORT ||
	previousToken.type === ParseTreeTokenType.DOT) {
		return addToken(previousToken, nextToken);
	}
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
};