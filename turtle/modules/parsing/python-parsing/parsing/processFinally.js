import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.TRY
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (!goodPreviousTypes.has(prev.type))
		return false;
	const children = prev.children;
	// There should be only 1 finally child within a try.
	// If one already exists, it is not a good previous.
	if (children.some(child => child.type === ParseTreeTokenType.FINALLY))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processFinally(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};