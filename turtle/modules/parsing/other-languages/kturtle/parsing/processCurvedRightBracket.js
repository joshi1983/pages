import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return false;
	const children = token.children;
	if (children.length === 0)
		return false;
	if (children[children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurvedRightBracket(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	if (previousToken.parentNode !== null) {
		return previousToken.parentNode;
	}
	return previousToken;
};