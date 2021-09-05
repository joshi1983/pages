import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPreviousForWhileLoop(prev) {
	if (prev.parentNode === null)
		return true;
	if (!goodPrevTypes.has(prev.type))
		return false;
	return true;
}

export function getGoodPreviousForWhileLoop(prev) {
	while (!isGoodPreviousForWhileLoop(prev))
		prev = prev.parentNode;

	return prev;
};