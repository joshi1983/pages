import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const dimPrevTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (dimPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token)) {
		token = token.parentNode;
	}
	return token;
}

export function processDim(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};