import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.ARG_LIST,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
ParseTreeTokenType.VECTOR_EXPRESSION,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
		return false;
	if (goodPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};