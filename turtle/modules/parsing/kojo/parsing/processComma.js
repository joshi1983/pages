import { isComplete } from './isCompleteWithNext.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ARRAY_VALUES_BLOCK,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.VAR
]);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (isComplete(token) === MaybeDecided.No)
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;

	return token;
}

function shouldCreateTupleLiteral(prev) {
	if (prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return true;

	return false;
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateTupleLiteral(prev)) {
		prev.type = ParseTreeTokenType.TUPLE_LITERAL;
	}
	prev.appendChild(next);
	return prev;
};