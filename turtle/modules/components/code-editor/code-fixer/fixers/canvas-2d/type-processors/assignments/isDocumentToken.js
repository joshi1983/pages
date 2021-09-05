import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function isDocumentToken(token) {
	const child = token.children[0];
	if (child !== undefined && child.val === 'document' &&
	child.type === ParseTreeTokenType.IDENTIFIER)
		return true;
	return false;
};