import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.TYPE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isComplete(token) === MaybeDecided.No)
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processStruct(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};