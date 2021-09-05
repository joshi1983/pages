import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
const goodPrevTypes = new Set([
ParseTreeTokenType.ARG_LIST,
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.DECLARE,
ParseTreeTokenType.DOT_PROPERTY,
ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
ParseTreeTokenType.LOCAL,
ParseTreeTokenType.MACRO,
ParseTreeTokenType.INSTRUCTION_LIST,
ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VECTOR_EXPRESSION,
]);

function isGoodPrev(token) {
	if (token.parentNode === null)
		return true;
	if (token.type !== ParseTreeTokenType.INSTRUCTION_LIST &&
	ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
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

export function processIdentifier(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};