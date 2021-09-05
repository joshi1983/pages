import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

export function isMakeAssignment(token) {
	token = stringLiteralToAssignmentCommandToken(token);
	if (token === null)
		return false;
	return token.val === 'make';
};