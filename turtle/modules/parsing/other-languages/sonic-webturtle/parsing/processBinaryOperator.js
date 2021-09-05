import { isExpectingMoreChildren } from './isExpectingMoreChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodFirstOperandTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COMMAND,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.VARIABLE_REFERENCE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.children.length === 2)
		return false; // keep going up the tree.
	if (goodFirstOperandTokenTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	if (token.children.length !== 0) {
		let tok = token.children[token.children.length - 1];
		for (;tok.children.length !== 0;tok = tok.children[tok.children.length - 1]) {
			if (goodFirstOperandTokenTypes.has(tok.type) &&
			!isExpectingMoreChildren(tok))
				return tok;
		}
	}
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldMakePreviousFirstChild(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.TREE_ROOT ||
	previousToken.parentNode === null)
		return false;
	if (previousToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	previousToken.children.length < 2)
		return false;
	return true;
}

export function processBinaryOperator(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (shouldMakePreviousFirstChild(previousToken, nextToken)) {
		const parent = previousToken.parentNode;
		parent.replaceChild(previousToken, nextToken);
		nextToken.appendChild(previousToken);
	}
	return nextToken;
};