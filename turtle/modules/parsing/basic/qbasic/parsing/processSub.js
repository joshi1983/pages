import { getClosestOfType } from
'../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.EXIT
]);
const typesStartingWithEnd = new Set([
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SELECT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_SUB) {
		const children = token.children;
		return children.length < 2;
	}
	if (typesStartingWithEnd.has(token.type) &&
	token.children.length === 1)
		return getClosestOfType(token, ParseTreeTokenType.SUB) !== null;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processSub(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	if (typesStartingWithEnd.has(prev.type) &&
	prev.children.length === 1) {
		const nearbySub = getClosestOfType(prev, ParseTreeTokenType.SUB);
		prev.type = ParseTreeTokenType.END_SUB;
		prev.remove();
		nearbySub.appendChild(prev);
	}
	prev.appendChild(next);

	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.END_SUB &&
	parent.type === ParseTreeTokenType.SUB)
		return parent.parentNode;
	if (prev.type === ParseTreeTokenType.EXIT)
		return parent;
	return next;
};