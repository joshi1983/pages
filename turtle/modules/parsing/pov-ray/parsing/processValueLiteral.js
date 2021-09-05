import { addAngleBracketExpressionIfNeeded } from './addAngleBracketExpressionIfNeeded.js';
import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const appendChildTypes = new Set([
ParseTreeTokenType.ARG_LIST,
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.CASE,
ParseTreeTokenType.CONDITIONAL_TERNARY,
ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.INSTRUCTION_LIST,
ParseTreeTokenType.KEY_VALUE_PAIR,
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
ParseTreeTokenType.TREE_ROOT,
ParseTreeTokenType.VECTOR_EXPRESSION,
]);
const goodPreviousTypes = new Set([
]);
SetUtils.addAll(goodPreviousTypes, appendChildTypes);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const hasAllChildrenResult = hasAllExpectedChildren(token);
	if (ExpectedChildrenResult.canBeComplete(hasAllChildrenResult))
		return false;
	if (!goodPreviousTypes.has(token.type))
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processValueLiteral(prev, next) {
	prev = getGoodPrevious(prev);
	prev = addAngleBracketExpressionIfNeeded(prev, next);
	if (appendChildTypes.has(prev.type)) {
		prev.appendChild(next);
	}
	else
		prev.appendSibling(next);
	return prev;
};