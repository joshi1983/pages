import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function evaluateIdentifierToken(token) {
	if (token.val === 'Math' &&
	token.children.length === 1 &&
	token.children[0].type === ParseTreeTokenType.DOT) {
		const grandChild = token.children[0].children[0];
		if (grandChild !== undefined &&
		grandChild.type === ParseTreeTokenType.IDENTIFIER &&
		grandChild.children.length === 0)
			return Math[grandChild.val];
	}
};