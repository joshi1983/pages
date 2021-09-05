import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LEARN,
	ParseTreeTokenType.PARAMETERS_PARENT,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.WHILE
]);

function isBadPrevious(token) {
	if (badPreviousTypes.has(token))
		return true;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		return token.children.length < 2;
	}
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return token.children[token.children.length - 1].type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	return true;
}

function getGoodPrevious(token) {
	if (isBadPrevious(token) && token.children.length !== 0) {
		while (isBadPrevious(token) && token.children.length !== 0)
			token = token.children[token.children.length - 1];
		return token;
	}
	while (token.parentNode !== null && !isBadPrevious(token.parentNode))
		token = token.parentNode;
	return token;
}

export function processBinaryOperator(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	const prevParent = previousToken.parentNode;
	if (prevParent === null) {
		previousToken.appendChild(nextToken);
	}
	else {
		prevParent.replaceChild(previousToken, nextToken);
		nextToken.appendChild(previousToken);
	}
	return nextToken;
};