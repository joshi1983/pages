import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getRoughNameFrom(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;

	const children = token.children;
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		if (children.length === 3)
			return getRoughNameFrom(children[2]);
	}
};