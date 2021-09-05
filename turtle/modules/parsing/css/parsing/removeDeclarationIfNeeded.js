import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function removeDeclarationIfNeeded(prev) {
	let tok = prev;
	while (tok !== null && tok.type !== ParseTreeTokenType.DECLARATION) {
		if (tok.type === ParseTreeTokenType.SELECTOR ||
		tok.type === ParseTreeTokenType.AT_RULE)
			return prev;
		tok = tok.parentNode;
	}
	if (tok === null)
		return prev;
	if (tok.type === ParseTreeTokenType.DECLARATION &&
	tok.children.length === 1) {
		const isReplacingPrev = tok === prev;
		tok = tok.removeSingleToken();
		if (isReplacingPrev) {
			if (tok.children.length !== 0)
				return tok.children[tok.children.length - 1];
			return tok;
		}
	}
	return prev;
};