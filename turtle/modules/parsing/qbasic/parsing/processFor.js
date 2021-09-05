import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.EXIT,
]);

// "for" means something special as an argument in an
// open statement.
// Learn more at:
// https://qbasic.com/documentation/OPEN.html
function shouldConvertToIdentifier(prev) {
	prev = getClosestOfType(prev, ParseTreeTokenType.ARG_LIST);
	if (prev === null || prev.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const parent = prev.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const nameToken = parent.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return nameToken.val.toLowerCase() === 'open';
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	shouldConvertToIdentifier(token))
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processFor(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	if (shouldConvertToIdentifier(prev))
		next.type = ParseTreeTokenType.IDENTIFIER;

	prev.appendChild(next);
	if (next.type === ParseTreeTokenType.IDENTIFIER)
		return prev;
	else
		return next;
};