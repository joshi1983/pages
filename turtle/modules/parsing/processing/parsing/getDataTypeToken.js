import { declaringTypes } from './declaringTypes.js';
import { getHighestOfType } from
'../../generic-parsing-utilities/getHighestOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const notDataTypeAncestorTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CONDITIONAL_TERNARY,
	ParseTreeTokenType.UNARY_OPERATOR
]);

function cantBeDataTypeToken(token) {
	while (token !== null) {
		const parent = token.parentNode;
		if (parent === null)
			return false;
		if (notDataTypeAncestorTypes.has(parent.type)) {
			return true;
		}
		token = parent;
	}
	return false;
}

function isPossibleDeclaringType(token) {
	if (declaringTypes.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT) {
		if (token.children.length !== 2)
			return false;
		const dot = token.children[1];
		if (dot.children.length !== 1)
			return false;
		return true;
	}
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		if (cantBeDataTypeToken(token))
			return false;
		return true;
	}
	return false;
}

export function getDataTypeToken(previousToken) {
	const dt = getHighestOfType(previousToken, ParseTreeTokenType.DATA_TYPE);
	if (dt !== null)
		previousToken = dt;
	const e = getHighestOfType(previousToken, ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION);
	if (e !== null)
		previousToken = e;
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER &&
	previousToken.children.length === 0)
		previousToken = previousToken.getPreviousSibling();
	else
		return;
	if (previousToken === null)
		return;
	if (isPossibleDeclaringType(previousToken)) {
		return previousToken;
	}
};