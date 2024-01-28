import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { stringLiteralToAssignmentCommandToken } from '../optimize-variable-access/stringLiteralToAssignmentCommandToken.js';

export function isMakeAssignment(token) {
	const argList = token.parentNode;
	if (argList === null || argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	if (argList.children.indexOf(token) !== 1)
		return false;
	token = stringLiteralToAssignmentCommandToken(token);
	if (token === null)
		return false;
	return token.val === 'make';
};