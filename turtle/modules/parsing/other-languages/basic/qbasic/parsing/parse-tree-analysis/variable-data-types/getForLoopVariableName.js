import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getForLoopVariableName(forToken) {
	/*
	This will traverse through "TO" and "=" tokens to the for-loop variable name.
	*/
	let tok = forToken;
	while (tok !== undefined) {
		const children = tok.children;
		if (tok.type === ParseTreeTokenType.IDENTIFIER && children.length === 0) {
			return tok.val.toLowerCase();
		}
		tok = children[0];
	}
};