import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getJossName(functionCallToken) {
	const firstChild = functionCallToken.children[0];
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val;
};