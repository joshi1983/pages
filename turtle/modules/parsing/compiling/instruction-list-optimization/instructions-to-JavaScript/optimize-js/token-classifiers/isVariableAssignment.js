import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

function isMakeAssignment(token) {
	token = stringLiteralToAssignmentCommandToken(token);
	if (token === null)
		return false;
	return token.val === 'make';
}

// Checks for something like:
// context.make("x",30)
// context.localmake("x",30)
export function isVariableAssignment(token) {
	const p = stringLiteralToAssignmentCommandToken(token);
	if (p === null || (p.val !== 'make' && p.val !== 'localmake'))
		return false;
	return true;
};