import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const exceptParentTypes = new Set([
	ParseTreeTokenType.TRY
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (!exceptParentTypes.has(prev.type))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processExcept(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};