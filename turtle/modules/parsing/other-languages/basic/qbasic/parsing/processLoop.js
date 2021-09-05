import { isComplete } from './isComplete.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isComplete(token))
		return false;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processLoop(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.DO_WHILE ||
	prev.type === ParseTreeTokenType.DO_UNTIL)
		return prev.parentNode;
	return next;
};