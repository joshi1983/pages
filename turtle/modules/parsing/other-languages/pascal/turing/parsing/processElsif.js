import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	return token.type === ParseTreeTokenType.IF;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;

	return token;
}

export function processElsif(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};