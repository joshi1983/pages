import { declaringTypes } from '../optimize-variable-access/declaringTypes.js';
import { isVariableAssignmentRideSideToken } from './isVariableAssignmentRideSideToken.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isJSVariableDeclareAssignment(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let p = token.parentNode;
	if (p === null || p.val !== '=' || p.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	const rightSide = p.children[1];
	if (!isVariableAssignmentRideSideToken(rightSide))
		return false;
	p = p.parentNode;
	if (!declaringTypes.has(p.type))
		return false;
	return true;
};