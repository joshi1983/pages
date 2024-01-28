import { isValueStackLength } from './isValueStackLength.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
const unaryVals = new Set(['++', '--']);

export function isValueStackLengthUnaryUpdate(token) {
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR && unaryVals.has(token.val) &&
	token.children.length === 1) {
		return isValueStackLength(token.children[0]);
	}
	if (!isValueStackLength(token))
		return false;
	for (; token !== undefined; token = token.children[0]) {
		if (token.val === 'length') {
			const operatorToken = token.children[0];
			if (operatorToken === undefined)
				return false;
			return unaryVals.has(operatorToken.val) && operatorToken.children.length === 0;
		}
	}
	return false;
};