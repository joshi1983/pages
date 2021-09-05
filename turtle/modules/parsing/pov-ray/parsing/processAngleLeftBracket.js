import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPrevValueTypes = new Set([
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.VECTOR_EXPRESSION
]);
const vectorExpressionParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CONDITIONAL_TERNARY,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.UNARY_OPERATOR,// for example, - <3, 4, 5>
	ParseTreeTokenType.VECTOR_EXPRESSION,
]);

function isGoodVectorExpressionParent(token) {
	if (token.parentNode === null)
		return true;
	if (!vectorExpressionParentTypes.has(token.type))
		return false;
	return true;
}

function getGoodVectorExpressionParent(token) {
	while (!isGoodVectorExpressionParent(token))
		token = token.parentNode;
	return token;
}

function isGoodPrevValue(token) {
	if (token === null)
		return true;
	if (badPrevValueTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.parentNode !== null &&
	token.parentNode.val === '=' &&
	token.parentNode.parentNode !== null) {
		const grandParent = token.parentNode.parentNode;
		if (grandParent.type === ParseTreeTokenType.DECLARE || grandParent.type === ParseTreeTokenType.LOCAL)
			return false;
	}
	return isCompleteValueToken(token);
}

function shouldReturnNullForPreviousValueToken(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return token.children.length !== 2;
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR)
		return token.children.length !== 1;
	return false;
}

function getGoodPreviousValue(token) {
	if (shouldReturnNullForPreviousValueToken(token)) {
		return null;
	}
	if (token.children.length !== 0) {
		let tok = token;
		do {
			tok = tok.children[token.children.length - 1];
			if (isGoodPrevValue(tok)) {
				return tok;
			}
		} while (tok.children.length !== 0);
	}
	while (!isGoodPrevValue(token)) {
		if (!ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
			return null; // indicate unable to find good value token.
		token = token.parentNode;
	}
	return token;
}

function isInDeclareOrLocal(token) {
	const parent = token.parentNode;
	if (parent === null)
		return false;
	if (parent.type === ParseTreeTokenType.LOCAL ||
	parent.type === ParseTreeTokenType.DECLARE) {
		return true;
	}
	return false;
}

export function processAngleLeftBracket(prev, next) {
	const prevValToken = getGoodPreviousValue(prev);
	if (prevValToken === null || isInDeclareOrLocal(prevValToken)) {
		prev = getGoodVectorExpressionParent(prev);
		const e = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.VECTOR_EXPRESSION);
		e.appendChild(next);
		if (prev.parentNode !== null && ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(prev)))
			prev.appendSibling(e);
		else
			prev.appendChild(e);
		return e;
	}
	else {
		const parent = prevValToken.parentNode;
		if (parent === null) {
			prevValToken.appendChild(next);
			return next;
		}
		else {
			next.type = ParseTreeTokenType.BINARY_OPERATOR;
			parent.replaceChild(prevValToken, next);
			next.appendChild(prevValToken);
			return next;
		}
	}
};