import { addToken } from './addToken.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
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
		const parent = squareGroupToken.parentNode;
		if (parent !== null) {
			if (parent.type === ParseTreeTokenType.DATA_TYPE ||
			parent.type === ParseTreeTokenType.IDENTIFIER)
				return parent;
		}
		if (squareGroupToken.type !== ParseTreeTokenType.TREE_ROOT)
			return squareGroupToken;
	}
};