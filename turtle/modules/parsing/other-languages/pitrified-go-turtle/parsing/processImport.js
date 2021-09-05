import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.PACKAGE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	return !badPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processImport(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};