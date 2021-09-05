import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.INSTRUCTION_LIST,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (token.type !== ParseTreeTokenType.INSTRUCTION_LIST &&
	ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
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

export function processBreak(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};