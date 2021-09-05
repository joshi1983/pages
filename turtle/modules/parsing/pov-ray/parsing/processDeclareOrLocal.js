import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
ParseTreeTokenType.CODE_BLOCK,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.INSTRUCTION_LIST,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (goodPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processDeclareOrLocal(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};