import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getFirstCaseValueToken(switchToken) {
	const block = switchToken.children[1];
	if (block === undefined)
		return;
	for (const child of block.children) {
		if (child.type === ParseTreeTokenType.CASE) {
			return child.children[0];
		}
	}
};
