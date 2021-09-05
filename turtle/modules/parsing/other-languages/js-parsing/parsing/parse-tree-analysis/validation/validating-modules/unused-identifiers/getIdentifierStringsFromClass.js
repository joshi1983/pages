import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function getIdentifierStringsFromClass(token) {
	if (token.children.length !== 0) {
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
			return [firstChild.val];
	}
	return [];
};