import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.SWITCH_BODY
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processDefault(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};