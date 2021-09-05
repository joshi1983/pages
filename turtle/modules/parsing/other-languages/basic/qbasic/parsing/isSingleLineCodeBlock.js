import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function isSingleLineCodeBlock(token) {
	if (token.type !== ParseTreeTokenType.CODE_BLOCK ||
	token.children.length === 0 ||
	token.children[0].lineIndex !== token.lineIndex)
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.IF)
		return true;
	return false;
};