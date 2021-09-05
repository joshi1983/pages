import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isPropertyName(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		return parent.children[2] === token;
	}
	return false;
};