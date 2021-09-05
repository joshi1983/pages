import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function unwrapCurvedBracketExpression(token) {
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length > 1) {
		token = token.children[1];
	}
	return token;
};
