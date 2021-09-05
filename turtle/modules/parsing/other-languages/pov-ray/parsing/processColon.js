import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CONDITIONAL_TERNARY,
	ParseTreeTokenType.KEY_VALUE_PAIR
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processColon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};