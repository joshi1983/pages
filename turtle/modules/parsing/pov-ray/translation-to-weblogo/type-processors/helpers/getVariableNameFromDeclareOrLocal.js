import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getVariableNameFromDeclareOrLocal(token) {
	const child = token.children[0];
	if (child.children.length !== 0) {
		const varNameToken = child.children[0];
		if (varNameToken !== null && varNameToken.type === ParseTreeTokenType.IDENTIFIER) {
			return varNameToken.val;
		}
	}
};