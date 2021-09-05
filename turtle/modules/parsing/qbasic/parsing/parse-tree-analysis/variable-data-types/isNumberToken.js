import { evaluateToken } from '../../../evaluation/evaluateToken.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const definiteNumberTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL
]);

export function isNumberToken(token) {
	const val = evaluateToken(token);
	if (val !== undefined)
		return isNumber(val);
	const children = token.children;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (token.val === '+' || token.children.length !== 2)
			return false;
		return true;
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (children.length < 2)
			return false;
		return isNumberToken(children[1]);
	}
	return definiteNumberTypes.has(token.type);
};