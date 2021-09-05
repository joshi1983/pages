import { addToken } from './addToken.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldBeConvertedToDataType } from './shouldBeConvertedToDataType.js';

const squareGroupTypes = new Set([
	ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

const eIESkippableTypes = new Set([
	ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR,
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.IDENTIFIER
]);

function isPossibleParentForArrayDataTypeExpression(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.DATA_TYPE ||
	token.type === ParseTreeTokenType.IDENTIFIER ||
	token.type === ParseTreeTokenType.EXPRESSION_DOT ||
	token.type === ParseTreeTokenType.DOT)
		return false;
	return true;
}

// assumes squareGroupToken.type is ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR
function addArrayDataTypeExpressionIfNeeded(squareGroupToken) {
	if (squareGroupToken.type !== ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR)
		return;
	const parent = squareGroupToken.parentNode;
	if (parent.type === ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION)
		return; // not needed
	let token = parent;
	while (!isPossibleParentForArrayDataTypeExpression(token))
		token = token.parentNode;
	if (token !== null) {
		const arrayDataTypeExpression = 
			new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION);
		squareGroupToken.remove();
		const prev = token.children[token.children.length - 1];
		prev.remove();
		arrayDataTypeExpression.appendChild(prev);
		arrayDataTypeExpression.appendChild(squareGroupToken);
		token.appendChild(arrayDataTypeExpression);
	}
}

function getClosestGroupNeedingToClose(token) {
	while (token !== null &&
	token.type !== ParseTreeTokenType.TREE_ROOT &&
	(!squareGroupTypes.has(token.type) || endsWithSquareRightBracket(token)))
		token = token.parentNode;
	return token;
}

function getExpressionIndexExpression(token) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION)
			return token;
		if (!eIESkippableTypes.has(token.type))
			return;
		token = token.parentNode;
	}
}

function canBeDataType(token) {
	if (token === null)
		return false;
	if (token.type !== ParseTreeTokenType.IDENTIFIER &&
	token.type !== ParseTreeTokenType.DATA_TYPE)
		return false;
	return true;
}

export function processSquareRightBracket(previousToken, nextToken) {
	const squareGroupToken = getClosestGroupNeedingToClose(previousToken);
	if (squareGroupToken === null)
		addToken(previousToken, nextToken);
	else {
		if (squareGroupToken.type === ParseTreeTokenType.INDEX_EXPRESSION &&
		squareGroupToken.children.length === 1) {
			squareGroupToken.type = ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR;
			const expressionIndexExpression = getExpressionIndexExpression(squareGroupToken);
			if (expressionIndexExpression !== undefined)
				expressionIndexExpression.type = ParseTreeTokenType.DECLARATION;
			const prev = squareGroupToken.getPreviousSibling();
			if (canBeDataType(prev)) {
				if (shouldBeConvertedToDataType(prev))
					prev.type = ParseTreeTokenType.DATA_TYPE;
				squareGroupToken.remove();
				prev.appendChild(squareGroupToken);
			}
		}
		squareGroupToken.appendChild(nextToken);
		addArrayDataTypeExpressionIfNeeded(squareGroupToken);
		const parent = squareGroupToken.parentNode;
		if (parent !== null) {
			if (parent.type === ParseTreeTokenType.DATA_TYPE ||
			parent.type === ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION ||
			parent.type === ParseTreeTokenType.IDENTIFIER)
				return parent;
		}
		if (squareGroupToken.type !== ParseTreeTokenType.TREE_ROOT)
			return squareGroupToken;
	}
};