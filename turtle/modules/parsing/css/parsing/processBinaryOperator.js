import { addSelectorToken } from './addSelectorToken.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';

const valueTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.NUMBER_UNIT_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);
const goodPrevTypes = new Set([
]);
SetUtils.addAll(goodPrevTypes, valueTokenTypes);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (isCompleteValueToken(parent))
		return false;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return token.children.length === 2;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

function shouldBecomeChild(prev) {
	if (valueTokenTypes.has(prev.type) && prev.parentNode !== null) {
		if (prev.type === ParseTreeTokenType.BINARY_OPERATOR)
			return prev.children.length === 2;
		return true;
	}
	return false;
}

export function processBinaryOperator(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldBecomeChild(prev)) {
		const prevParent = prev.parentNode;
		prev.remove();
		next.appendChild(prev);
		prevParent.appendChild(next);
	}
	else {
		next.type = ParseTreeTokenType.WILDCARD;
		if (prev.type !== ParseTreeTokenType.SELECTOR)
			prev = addSelectorToken(prev);
		prev.appendChild(next);
	}
	return next;
};