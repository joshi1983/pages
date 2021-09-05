import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (!goodPrevTypes.has(token.type))
		return false;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token))) {
		return false;
	}
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processSquareRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};