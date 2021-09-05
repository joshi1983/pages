import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isFunctionBodyRoot(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.val === '=>')
		return true;
	if (token.type === ParseTreeTokenType.FUNCTION)
		return true;
	return false;
}

export function isInFunctionBody(token) {
	let tok = token.parentNode;
	while (tok !== null) {
		if (isFunctionBodyRoot(tok))
			return true;
		if (tok.type === ParseTreeTokenType.ARG_LIST &&
		tok.parentNode !== null &&
		tok.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR &&
		tok.parentNode.val === '=>') {
			tok = tok.parentNode;
		}
		tok = tok.parentNode;
	}
	return false;
};