import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function isIdentifierFromImport(token) {
	const parentToken = token.parentNode;
	if (parentToken.type === ParseTreeTokenType.IMPORT)
		return parentToken.children.indexOf(token) === 0; // default export.
	if (parentToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parentToken.val === 'as') {
		// Check if this is aliased.
		const grandParent = parentToken.parentNode;
		if (grandParent.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION) {
			const ggParent = grandParent.parentNode;
			if (ggParent.type === ParseTreeTokenType.IMPORT)
				return true;
		}
	}
	if (parentToken.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return false;
	const grandparent = parentToken.parentNode;
	if (grandparent.type !== ParseTreeTokenType.IMPORT)
		return false;
	return grandparent.children.indexOf(parentToken) === 0;
};