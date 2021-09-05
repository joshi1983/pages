import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.ARGUMENT_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (isCompleteToken(prev))
		return false;
	if (prev.type === ParseTreeTokenType.ARGUMENT_LIST &&
	prev.children[0].type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false; // if the ARGUMENT_LIST does not start with (,
		// it shouldn't end with ).
		// For that reason, it is not a good previous.

	return goodPrevTypes.has(prev.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processCurvedRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	prev.children.length === 2) {
		// () is a tuple instead of a curved bracket expression because it does not wrap a value expression.
		prev.type = ParseTreeTokenType.TUPLE_LITERAL;
	}
	const prevParent = prev.parentNode;
	if (prevParent !== null)
		return prevParent;
	return prev;
};