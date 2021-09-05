import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.DECLARATION
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (isCompleteValueToken(token))
		return false;
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	getClosestOfType(token, ParseTreeTokenType.AT_RULE) !== null) {
		return true;
	}
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processColon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};