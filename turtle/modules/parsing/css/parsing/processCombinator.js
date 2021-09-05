import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { processBinaryOperator } from
'./processBinaryOperator.js';
import { SetUtils } from
'../../../SetUtils.js';

const binaryPrevTokenTypes = new Set([
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.NUMBER_UNIT_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);
const goodPrevTypes = new Set([
	ParseTreeTokenType.SELECTOR
]);
SetUtils.addAll(goodPrevTypes, binaryPrevTokenTypes);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (parent.type === ParseTreeTokenType.SELECTOR)
		return false;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

function shouldBeConvertedToBinaryOperator(prev) {
	if (binaryPrevTokenTypes.has(prev.type) && prev.parentNode !== null) {
		const prevParent = prev.parentNode;
		return prevParent.type !== ParseTreeTokenType.SELECTOR &&
		prevParent.type !== ParseTreeTokenType.TREE_ROOT;
	}
	return false;
}

export function processCombinator(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldBeConvertedToBinaryOperator(prev)) {
		next.type = ParseTreeTokenType.BINARY_OPERATOR;
		return processBinaryOperator(prev, next);
	}
	else
		prev.appendChild(next);
	return next;
};