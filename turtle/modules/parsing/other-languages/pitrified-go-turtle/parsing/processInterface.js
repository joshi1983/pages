import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;

	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	parent.type === ParseTreeTokenType.TYPE)
		return false;

	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processInterface(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};