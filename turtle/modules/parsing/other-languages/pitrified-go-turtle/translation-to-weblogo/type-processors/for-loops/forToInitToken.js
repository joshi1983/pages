import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToInitToken(forToken) {
	const firstChild = forToken.children[0];
	if (firstChild === undefined ||
	firstChild.type === ParseTreeTokenType.CODE_BLOCK)
		return;
	return firstChild;
};