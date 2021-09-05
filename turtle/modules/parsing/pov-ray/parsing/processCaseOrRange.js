import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.SWITCH,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (goodPrevTypes.has(token.type)) {
		if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren))
			return false;
		return true;
	}
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processCaseOrRange(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};