import { isCompleteWithNext } from
'./isCompleteWithNext.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodTypes = new Set([
	ParseTreeTokenType.ARRAY_VALUES_BLOCK,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMPOSITE_LITERAL_VALUE,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.INTERFACE,
	ParseTreeTokenType.SELECT_BODY,
	ParseTreeTokenType.STRUCT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
	ParseTreeTokenType.SWITCH_BODY
]);

function isGoodPrevious(prev, next) {
	if (prev.parentNode === null)
		return true;
	if (isCompleteWithNext(prev, next))
		return false;

	return goodTypes.has(prev.type);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;
	return prev;
}

export function processCurlyRightBracket(prev, next) {
	prev = getGoodPrevious(prev, next);
	prev.appendChild(next);
	if (prev.parentNode === null ||
	prev.type === ParseTreeTokenType.STRUCT)
		return prev;
	return prev.parentNode;
};