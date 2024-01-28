import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function tokenToFunctionDefinitionName(token) {
	if (token.children.length > 1 &&
	token.children[0].type === ParseTreeTokenType.DEF &&
	token.children[1].type === ParseTreeTokenType.IDENTIFIER)
		return token.children[1].val;
};