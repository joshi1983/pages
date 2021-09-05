import { canBeTypeCastingExpression } from './canBeTypeCastingExpression.js';
import { declaringTypes } from './declaringTypes.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION,
	ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FINALLY,
	ParseTreeTokenType.METHOD_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TRY,
	ParseTreeTokenType.WHILE,
]);

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DATA_TYPE
]);

function isGoodPrevious(token) {
	if (canBeTypeCastingExpression(token))
		return true;
	if (goodPreviousTypes.has(token.type))
		return true;
	if (badPreviousTypes.has(token.type)) {
		if (token.children.length === 0) {
			if (token.type === ParseTreeTokenType.IF || token.type === ParseTreeTokenType.WHILE)
				return true;
		}
		return false;
	}
	if (token.type === ParseTreeTokenType.DOT) {
		return token.children.length === 0;
	}
	if (token.type === ParseTreeTokenType.IMPORT &&
	token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.NEW &&
	token.children.length !== 0 &&
	parent !== null &&
	parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	if (token.type === ParseTreeTokenType.DECLARATION &&
	token.children.length > 1)
		return false;
	if ((token.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) &&
	token.children.length === 2)
		return false;
	if (declaringTypes.has(token.type) && token.children.length !== 0)
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK) {
		if (token.children[0].type === ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		!endsWithCurlyRightBracket(token))
			return true;
		if (token.children[0].type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		token.children.length === 1)
			return false;
		if (token.parentNode.type === ParseTreeTokenType.METHOD ||
		token.parentNode.type === ParseTreeTokenType.STATIC)
			return false;
	}
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	endsWithClosingCurvedBracket(token))
		return false;
	if ((token.type === ParseTreeTokenType.STATIC) &&
	token.children.length !== 0)
		return false;
	return true;
}

export function getGoodPreviousForIdentifier(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const closestImport = getClosestOfType(token, ParseTreeTokenType.IMPORT);
		if (closestImport !== null)
			return closestImport.parentNode;
	}
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
};