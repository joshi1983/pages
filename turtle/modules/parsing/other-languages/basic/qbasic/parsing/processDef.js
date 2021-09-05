import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.EXIT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_DEF) {
		const children = token.children;
		return children.length < 2;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processDef(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);

	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.EXIT)
		return parent;

	if (prev.type === ParseTreeTokenType.END_DEF &&
	parent !== null &&
	parent.parentNode !== null)
		return prev.parentNode.parentNode;

	return next;
};