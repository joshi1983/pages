import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.DECLARATION,
	ParseTreeTokenType.DECLARATION_BLOCK,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isCompleteValueToken(token) === true)
		return false;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processSemicolon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};