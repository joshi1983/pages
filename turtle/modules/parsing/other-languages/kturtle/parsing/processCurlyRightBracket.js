import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	if (token.children.length === 0)
		return false;
	const children = token.children;
	if (children[children.length - 1].type === ParseTreeTokenType.CURLY_RIGHT_BRACKET)
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (token.parentNode !== null && !isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurlyRightBracket(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	previousToken.appendChild(nextToken);
	if (previousToken.parentNode !== null) {
		const token = previousToken.parentNode;
		if (token.type === ParseTreeTokenType.LEARN && token.parentNode !== null)
			return token.parentNode;
		return token;
	}
	return previousToken;
};