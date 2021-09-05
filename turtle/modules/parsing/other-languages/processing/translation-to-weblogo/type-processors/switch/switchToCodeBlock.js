import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function switchToCodeBlock(switchToken) {
	const children = switchToken.children;
	if (children.length < 2)
		return null;

	const result = children[1];
	if (result.type !== ParseTreeTokenType.CODE_BLOCK)
		return null;
	return result;
}; 