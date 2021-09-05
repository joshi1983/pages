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
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
	ParseTreeTokenType.ARRAY_VALUES_BLOCK,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.COMPOSITE_LITERAL_VALUE,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.STRUCT,
	ParseTreeTokenType.STRUCT_VALUES_EXPRESSION,
	ParseTreeTokenType.TYPE_PARAMETERS,
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
	const parent = token.parentNode;
	if (parent === null)
		return true;

	const children = token.children;
	if ((token.type === ParseTreeTokenType.FOR ||
	token.type === ParseTreeTokenType.IF) &&
	children.length === 1) {
		return true;
	}
	else if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	children.length === 2) {
		const first = children[0];
		if (first.type === ParseTreeTokenType.COMMA_EXPRESSION) {
			const second = children[1];
			if (isUnassignableToCommaExpression(second))
				return true;
		}
	}

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	const children = token.children;
	if ((token.type === ParseTreeTokenType.TREE_ROOT ||
	token.type === ParseTreeTokenType.CODE_BLOCK ||
	token.type === ParseTreeTokenType.CONST ||
	token.type === ParseTreeTokenType.VAR) &&
	children.length !== 0) {
		const last = children[children.length - 1];
		if (last.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		last.children.length !== 0) {
			const e = last.children[last.children.length - 1];
			if (!badCETypes.has(e.type)) {
				return last;
			}
		}
	}
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
	prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	prev.type === ParseTreeTokenType.FOR ||
	prev.type === ParseTreeTokenType.IF)
		return true;

	return false;
}

function shouldCreateEarlierCommaExpression(ce) {
	const parent = ce.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children.length === 2) {
		const commaToken = parent.getPreviousSibling();
		if (commaToken !== null && commaToken.type === ParseTreeTokenType.COMMA &&
		commaToken.getPreviousSibling() !== null) {
			const first = parent.children[0];
			if (first.type === ParseTreeTokenType.IDENTIFIER) {
				return true;
			}
		}
	}
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
		if (shouldCreateEarlierCommaExpression(ce)) {
			const commaToken = ce.parentNode.getPreviousSibling();
			const prev = commaToken.getPreviousSibling();
			const last = ce.parentNode.children[0];
			const ce2 = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.COMMA_EXPRESSION);
			prev.remove();
			commaToken.remove();
			ce.parentNode.replaceChild(last, ce2);
			ce2.appendChild(prev);
			ce2.appendChild(commaToken);
			ce2.appendChild(last);
		}
		return ce;
	}
	else
		prev.appendChild(next);
	return prev;
};