import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.LIST_LITERAL, // for-loop might be in a list-comprehension expression.
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (!goodPrevTypes.has(prev.type))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;

	return prev;
};

export function processForLoop(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};