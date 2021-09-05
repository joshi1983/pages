import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.EXIT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.EXIT) {
		const children = token.children;
		return children.length < 1;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processDo(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.EXIT)
		return prev.parentNode;
	return next;
};