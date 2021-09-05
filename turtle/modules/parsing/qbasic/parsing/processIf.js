import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.END_IF,
]);

function isGoodPrevious(token, next) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_IF) {
		const children = token.children;
		if (children.length >= 2)
			return false;
		if (children.length === 1 &&
		token.lineIndex !== next.lineIndex)
			return false;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token, next) {
	while (!isGoodPrevious(token, next))
		token = token.parentNode;
	return token;
}

export function processIf(prev, next) {
	prev = getGoodPrevious(prev, next);
	prev.appendChild(next);
	return next;
};