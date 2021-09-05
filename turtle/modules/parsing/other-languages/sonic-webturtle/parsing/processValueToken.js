import { isExpectingMoreChildren } from './isExpectingMoreChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.VARIABLE_REFERENCE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isExpectingMoreChildren(token))
		return true;
	return !badPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	if (token.children.length !== 0) {
		let tok = token.children[token.children.length - 1];
		for (; tok.children.length !== 0; tok = tok.children[tok.children.length - 1]) {
			if (isExpectingMoreChildren(tok))
				return tok;
		}
	}
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processValueToken(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	return nextToken;
};