import { isLastValueStackElementExpression } from './isLastValueStackElementExpression.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isLastValueStackElementAssignment(token) {
	if (token.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	if (!isLastValueStackElementExpression(token.children[0]))
		return false;
	return true;
};