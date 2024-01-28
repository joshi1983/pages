import { isGlobalVariablesSetCall } from './isGlobalVariablesSetCall.js';
import { isLocalVariablesSetCall } from './isLocalVariablesSetCall.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

// Checks for something like:
// context.make("x",30)
// context.localmake("x",30)
export function isVariableAssignment(token) {
	if (isLocalVariablesSetCall(token) || isGlobalVariablesSetCall(token))
		return true;
	const argList = token.parentNode;
	if (argList === null || argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const childIndex = argList.children.indexOf(token);
	if (childIndex !== 1)
		return false;
	const p = stringLiteralToAssignmentCommandToken(token);
	if (p === null || (p.val !== 'make' && p.val !== 'localmake'))
		return false;
	return true;
};