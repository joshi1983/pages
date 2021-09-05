import { addToken } from './addToken.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.METHOD,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

const expressionIndexExpressionPreviousTypes = new Set([
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.METHOD_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.THIS
]);

function addArrayInstanceExpressionIfNeeded(indexExpressionToken) {
	const parent = indexExpressionToken.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.NEW)
		return;
	if (parent.children.indexOf(indexExpressionToken) !== 1)
		return;
	const prev = parent.children[0];
	if (prev.type === ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION)
		return;
	const arrayIE = new ParseTreeToken(null, indexExpressionToken.lineIndex, indexExpressionToken.colIndex, 
	ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION);
	indexExpressionToken.remove();
	prev.remove();
	arrayIE.appendChild(prev);
	arrayIE.appendChild(indexExpressionToken);
	parent.appendChild(arrayIE);
}

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.DATA_TYPE ||
	token.type === ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION)
		return true;
	const parent = token.parentNode;
	if (parent === null || parent.type === ParseTreeTokenType.TREE_ROOT ||
	parent.type === ParseTreeTokenType.CODE_BLOCK)
		return true;
	if (parent.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return true;
	if (parent.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION &&
	!endsWithCurlyRightBracket(token.parentNode))
		return true;
	if ((parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	parent.type === ParseTreeTokenType.ARG_LIST) &&
	!endsWithClosingCurvedBracket(parent))
		return true;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR)
		return true;
	if (parent.type === ParseTreeTokenType.NEW)
		return false;
	if (badPreviousTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK) {
		if (endsWithCurlyRightBracket(token)) {
			return false;
		}
	}
	else if (token.type === ParseTreeTokenType.IDENTIFIER) {
		return token.children.length === 0 ||
		token.parentNode.type === ParseTreeTokenType.TREE_ROOT;
	}
	return true;
}

function getGoodPreviousForArrayInstanceExpression(previousToken) {
	while (previousToken !== null) {
		if (previousToken.type === ParseTreeTokenType.NEW ||
		previousToken.type === ParseTreeTokenType.ARRAY_INSTANCE_EXPRESSION)
			return previousToken;
		if (previousToken.type === ParseTreeTokenType.ARG_LIST)
			return;
		previousToken = previousToken.parentNode;
	}
}

function getGoodPrevious(token) {
	let goodPrev = getGoodPreviousForArrayInstanceExpression(token);
	if (goodPrev !== undefined)
		return goodPrev;
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldCreateExpressionIndexExpressionForPrevious(previousToken) {
	let parent = previousToken.parentNode;
	if (parent !== null && parent.type === ParseTreeTokenType.NEW)
		return false;
	if (!expressionIndexExpressionPreviousTypes.has(previousToken.type))
		return false;
	let tok = parent;
	while (tok !== null) {
		parent = tok.parentNode;
		if (parent === null)
			break;
		if (parent.children.indexOf(tok) !== 0)
			break;
		if (parent.type === ParseTreeTokenType.NEW)
			return false;
		tok = parent;
	}
	return true;
}

function shouldBeArrayDimensionIndicator(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type === ParseTreeTokenType.NEW)
		return false;
	if (token.type === ParseTreeTokenType.DATA_TYPE)
		return true;
	return false;
}

function isGoodPreviousTokenForIndexExpressionIndex(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return true;
	if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (!endsWithClosingCurvedBracket(parent))
			return false;
		return true;
	}
	if (parent.type === ParseTreeTokenType.INDEX_EXPRESSION) {
		if (!endsWithSquareRightBracket(parent))
			return false;
		return true;
	}
	return expressionIndexExpressionPreviousTypes.has(parent.type);
}

function getPreviousTokenForExpressionIndexExpression(previousToken) {
	while (isGoodPreviousTokenForIndexExpressionIndex(previousToken)) {
		previousToken = previousToken.parentNode;
	}
	return previousToken;
}

function getExpressionIndexExpression(token) {
	const parent = token.parentNode;
	if (parent === null)
		return;
	if (parent.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION)
		return parent;
}

export function processSquareLeftBracket(previousToken, nextToken) {
	let newParentType;
	previousToken = getGoodPrevious(previousToken);
	newParentType = ParseTreeTokenType.INDEX_EXPRESSION;
	if (shouldBeArrayDimensionIndicator(previousToken)) {
		newParentType = ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR;
		const e = getExpressionIndexExpression(previousToken);
		if (e !== undefined) {
			e.type = ParseTreeTokenType.DECLARATION;
		}
	}
	const newParentToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, newParentType);
	if (newParentType === ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR) {
		newParentToken.appendChild(nextToken);
		previousToken.appendChild(newParentToken);
		return newParentToken;
	}
	if (newParentType === ParseTreeTokenType.INDEX_EXPRESSION) {
		if (shouldCreateExpressionIndexExpressionForPrevious(previousToken)) {
			const eieToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex,
				ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION);
			previousToken = getPreviousTokenForExpressionIndexExpression(previousToken);
			const prevParent = previousToken.parentNode;
			previousToken.remove();
			eieToken.appendChild(previousToken);
			eieToken.appendChild(newParentToken);
			prevParent.appendChild(eieToken);
		}
		else {
			previousToken.appendChild(newParentToken);
			addArrayInstanceExpressionIfNeeded(newParentToken);
		}
	}
	else {
		addToken(previousToken, newParentToken);
	}
	newParentToken.appendChild(nextToken);
};