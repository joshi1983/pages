import { isValueStackLength } from './isValueStackLength.js';
import { isValueStackLengthUnaryUpdate } from './isValueStackLengthUnaryUpdate.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isValueStackLengthUpdate(token) {
	if (token.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.type !== ParseTreeTokenType.UNARY_OPERATOR &&
	token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	(token.val === '-=' || token.val === '=' || token.val === '+=')) {
		if (!isValueStackLength(token.children[0]))
			return false;
	}
	else if (token.children.length === 1) {
		return isValueStackLengthUnaryUpdate(token);
	}
	if (token.children.length === 2) {
		const rightOperand = token.children[1];
		if (rightOperand.type !== ParseTreeTokenType.NUMBER_LITERAL)
			return false;
		return true;
	}
	return false;
};