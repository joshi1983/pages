import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToCodeBlock(forToken) {
	const children = forToken.children;
	const result = children[children.length - 1];
	if (result !== undefined || result.type === ParseTreeTokenType.CODE_BLOCK)
		return result;
};