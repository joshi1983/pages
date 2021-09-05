import { declaringTypes } from '../../../../../js-parsing/parsing/declaringTypes.js';
import { isVariableAssignmentRightSideToken } from './isVariableAssignmentRightSideToken.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isJSVariableDeclareAssignment(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let p = token.parentNode;
	if (p === null || p.val !== '=' || p.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	const rightSide = p.children[1];
	if (!isVariableAssignmentRightSideToken(rightSide))
		return false;
	p = p.parentNode;
	if (!declaringTypes.has(p.type))
		return false;
	return true;
};