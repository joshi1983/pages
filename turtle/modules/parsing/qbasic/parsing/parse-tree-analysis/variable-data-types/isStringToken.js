import { evaluateToken } from '../../../evaluation/evaluateToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const definiteStringTypes = new Set([
	ParseTreeTokenType.STRING_LITERAL
]);

export function isStringToken(token) {
	const val = evaluateToken(token);
	if (val !== undefined)
		return typeof val === 'string';
	const children = token.children;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.val !== '+' || token.children.length !== 2)
			return false;
		if (isStringToken(children[0]) || isStringToken(children[1]))
			return true;
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (children.length < 2)
			return false;
		return isStringToken(children[1]);
	}
	return definiteStringTypes.has(token.type);
};