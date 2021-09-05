import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isNonemptyCase(token) {
	if (token.type !== ParseTreeTokenType.CASE)
		return false;

	const codeBlock = token.children[token.children.length - 1];
	if (codeBlock === undefined ||
	codeBlock.type !== ParseTreeTokenType.CODE_BLOCK ||
	codeBlock.children.length === 0)
		return false;

	return true;
};