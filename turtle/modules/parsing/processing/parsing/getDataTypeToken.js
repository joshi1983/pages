import { declaringTypes } from './declaringTypes.js';
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
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		if (cantBeDataTypeToken(token))
			return false;
		return true;
	}
	return false;
}

export function getDataTypeToken(previousToken) {
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