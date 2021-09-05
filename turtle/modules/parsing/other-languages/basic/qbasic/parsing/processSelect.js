import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.END_SELECT,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_SELECT) {
		return token.children.length < 2;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processSelect(prev, next) {
	prev = getGoodPrevious(prev);
	if (prev.type === ParseTreeTokenType.END_SELECT) {
		prev.appendChild(next);
		const parent = prev.parentNode;
		if (parent.parentNode !== null)
			return parent.parentNode;
		else
			return parent;
	}
	prev.appendChild(next);
	return next;
};