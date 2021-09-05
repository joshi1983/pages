import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.EXIT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_FUNCTION)
		return token.children.length < 2;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processFunction(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);

	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.END_FUNCTION &&
	parent.type === ParseTreeTokenType.FUNCTION)
		return parent.parentNode;
	return next;
};