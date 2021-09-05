import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badCETypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FUNC,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET
]);

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.COMPOSITE_LITERAL_VALUE,
	ParseTreeTokenType.VAR
]);

const unassignableToCommaExpressionTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);

function isUnassignableToCommaExpression(token) {
	if (unassignableToCommaExpressionTypes.has(token.type))
		return true;
	return false;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 2) {
		const first = token.children[0];
		if (first.type === ParseTreeTokenType.COMMA_EXPRESSION) {
			const second = token.children[1];
			if (isUnassignableToCommaExpression(second))
				return true;
		}
	}

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;

	return token;
}

function getGoodPrevChild(prev) {
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined || badCETypes.has(lastChild.type))
		return; // indicate the last child is not good.

	return lastChild;
}

function shouldCreateCommaExpression(prev) {
	if (prev.type === ParseTreeTokenType.TREE_ROOT ||
	prev.type === ParseTreeTokenType.CODE_BLOCK ||
	prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;
	return false;
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateCommaExpression(prev)) {
		const ce = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.COMMA_EXPRESSION);
		const prevChild = getGoodPrevChild(prev);
		if (prevChild !== undefined) {
			prev.replaceChild(prevChild, ce);
			prevChild.remove();
			ce.appendChild(prevChild);
		}
		else {
			prev.appendChild(ce);
		}
		ce.appendChild(next);
		return ce;
	}
	else
		prev.appendChild(next);
	return prev;
};