import { addValueTokenIfNeeded } from './addValueTokenIfNeeded.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const badPrevTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.NUMBER_UNIT_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const completeResult = isCompleteValueToken(token);
	if (completeResult === true)
		return false;
	if (badPrevTypes.has(token.type))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processValueLiteral(prev, next) {
	prev = getGoodPrevious(prev);
	prev = addValueTokenIfNeeded(prev, next);
	if (prev === next)
		return next;

	prev.appendChild(next);
	return next;
};