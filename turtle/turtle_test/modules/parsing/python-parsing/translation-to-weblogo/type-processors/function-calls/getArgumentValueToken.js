import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getArgumentValueToken(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && token.children.length === 2)
		return token.children[1];
	return token;
};