import { ParseTreeTokenType } from
'../../../../../ParseTreeTokenType.js';

export function isFunctionCallingItself(idToken) {
	if (idToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = idToken.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	let tok = parent;
	while (tok !== null) {
		if (tok.type === ParseTreeTokenType.FUNCTION) {
			const nameToken = tok.children[0];
			if (nameToken.type === ParseTreeTokenType.IDENTIFIER) {
				if (nameToken.val === idToken.val)
					return true;
			}
		}
		tok = tok.parentNode;
	}
	return false;
};