import { createInstructionList } from './createInstructionList.js';
import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
]);
const typesNeedingInstructionLists = new Set([
ParseTreeTokenType.CASE,
ParseTreeTokenType.IF,
ParseTreeTokenType.IFDEF,
ParseTreeTokenType.IFNDEF,
ParseTreeTokenType.MACRO,
ParseTreeTokenType.RANGE,
ParseTreeTokenType.WHILE
]);
const stopTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.INSTRUCTION_LIST
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (!goodPrevTypes.has(token.type))
		return false;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token))) {
		return false;
	}
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processCurvedRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	while (prev.parentNode !== null &&
	!stopTypes.has(prev.type) &&
	ExpectedChildrenResult.RIGIDLY_EQUAL === hasAllExpectedChildren(prev))
		prev = prev.parentNode;
	if (typesNeedingInstructionLists.has(prev.type))
		return createInstructionList(prev, next);
	return prev;
};