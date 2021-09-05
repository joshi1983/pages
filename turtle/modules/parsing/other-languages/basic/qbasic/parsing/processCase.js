import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (goodPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCase(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};