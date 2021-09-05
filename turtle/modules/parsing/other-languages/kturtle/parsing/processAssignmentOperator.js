import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.FOR && token.children.length === 1) {
		return token.children[0];
	}
	if (token.type === ParseTreeTokenType.CODE_BLOCK &&
	token.children[token.children.length - 1].type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
		return token.children[token.children.length - 1];
	}
	return token;
}

export function processAssignmentOperator(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (previousToken.type === ParseTreeTokenType.TREE_ROOT &&
	previousToken.children.length > 0)
		previousToken = previousToken.children[previousToken.children.length - 1];
	const prevParent = previousToken.parentNode;
	if (prevParent !== null) {
		prevParent.replaceChild(previousToken, nextToken);
		nextToken.appendChild(previousToken);
		if (nextToken.children.length === 2)
			return prevParent;
	}
	else
		previousToken.appendChild(nextToken);
	return nextToken;
};