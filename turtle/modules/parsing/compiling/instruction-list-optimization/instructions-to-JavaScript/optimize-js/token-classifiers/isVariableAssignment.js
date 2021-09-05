import { isGlobalVariablesSetCall } from './isGlobalVariablesSetCall.js';
import { isLocalVariablesSetCall } from './isLocalVariablesSetCall.js';
import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

// Checks for something like:
// context.make("x",30)
// context.localmake("x",30)
export function isVariableAssignment(token) {
	if (isLocalVariablesSetCall(token) || isGlobalVariablesSetCall(token))
		return true;
	const p = stringLiteralToAssignmentCommandToken(token);
	if (p === null || (p.val !== 'make' && p.val !== 'localmake'))
		return false;
	return true;
};