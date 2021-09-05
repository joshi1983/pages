import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function tokenToFunctionDefinitionName(token) {
	const children = token.children;
	if (children.length > 1 &&
	children[0].type === ParseTreeTokenType.DEF &&
	children[1].type === ParseTreeTokenType.IDENTIFIER)
		return children[1].val;
};