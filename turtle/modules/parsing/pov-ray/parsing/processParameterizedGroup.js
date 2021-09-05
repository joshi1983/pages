import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.INSTRUCTION_LIST)
		return true;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processParameterizedGroup(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(next)))
		return prev;
	else
		return next;
};