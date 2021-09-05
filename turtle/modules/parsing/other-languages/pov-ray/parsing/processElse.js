import { createInstructionList } from './createInstructionList.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IFDEF,
	ParseTreeTokenType.IFNDEF,
	ParseTreeTokenType.SWITCH
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (goodPreviousTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processElse(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return createInstructionList(next);
};