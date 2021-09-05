import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.INSTRUCTION_LIST,
ParseTreeTokenType.SWITCH,
ParseTreeTokenType.TREE_ROOT,
ParseTreeTokenType.VECTOR_EXPRESSION,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (hasAllExpectedChildren(token) === ExpectedChildrenResult.RIGIDLY_EQUAL)
		return false;
	if (goodPrevTypes.has(token.type))
		return true;
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrev(token))
		token = token.parentNode;
	return token;
}

export function processSemicolon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};