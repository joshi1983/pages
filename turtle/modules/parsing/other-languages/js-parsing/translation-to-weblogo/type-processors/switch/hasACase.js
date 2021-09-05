import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function hasACase(switchToken) {
	const block = switchToken.children[1];
	if (block === undefined || block.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	return block.children.some(c => c.type === ParseTreeTokenType.CASE);
};