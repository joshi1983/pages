import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function getFirstCaseBlock(switchToken) {
	const block = switchToken.children[1];
	if (block === undefined)
		return;
	for (const child of block.children) {
		if (child.type === ParseTreeTokenType.CASE) {
			const block = child.children[2];
			if (block.type === ParseTreeTokenType.CODE_BLOCK)
				return block;
		}
	}
};
