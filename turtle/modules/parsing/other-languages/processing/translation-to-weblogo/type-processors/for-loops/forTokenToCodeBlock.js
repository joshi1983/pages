import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forTokenToCodeBlock(forToken) {
	const result = forToken.children[1];
	if (result === undefined || result.type !== ParseTreeTokenType.CODE_BLOCK)
		return null;
	return result;
};