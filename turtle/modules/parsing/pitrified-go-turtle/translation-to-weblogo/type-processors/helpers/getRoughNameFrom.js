import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getRoughNameFrom(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;

	const children = token.children;
	if (token.type === ParseTreeTokenType.SET_PROPERTY)
		return children[1].val;
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	children.length > 3)
		return getRoughNameFrom(children[3]);
};