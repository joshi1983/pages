import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.parentNode === null ||
	token.type === ParseTreeTokenType.WHILE)
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processWend(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	const parent = prev.parentNode;
	if (parent !== null)
		return parent;
	return prev;
};