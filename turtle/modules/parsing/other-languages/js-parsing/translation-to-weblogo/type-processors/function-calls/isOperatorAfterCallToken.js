import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isOperatorAfterCallToken(callToken) {
	const parent = callToken.parentNode;
	if (parent === null)
		return false;
	const index = parent.children.indexOf(callToken);
	const next = parent.children[index + 1];
	if (next !== undefined) {
		if (parent.type === ParseTreeTokenType.BINARY_OPERATOR)
			return true;
	}
	return false;
};