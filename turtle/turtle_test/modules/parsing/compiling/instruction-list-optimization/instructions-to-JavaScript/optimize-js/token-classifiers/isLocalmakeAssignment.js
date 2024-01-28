import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

export function isLocalmakeAssignment(token) {
	token = stringLiteralToAssignmentCommandToken(token);
	if (token === null)
		return false;
	return token.val === 'localmake';
};