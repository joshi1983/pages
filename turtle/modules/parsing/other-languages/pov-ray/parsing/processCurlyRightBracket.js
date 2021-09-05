import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.CODE_BLOCK,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
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

export function processCurlyRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION &&
	prev.parentNode !== null)
		prev = prev.parentNode;
	while (prev.parentNode !== null &&
	prev.type !== ParseTreeTokenType.INSTRUCTION_LIST &&
	ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(prev)))
		prev = prev.parentNode;
	return prev;
};