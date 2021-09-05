import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToIncrementToken(forToken) {
	let j = 0;
	for (const child of forToken.children) {
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (child.type === ParseTreeTokenType.CODE_BLOCK)
				return;
			if (j === 2) {
				return child;
			}
			j++;
		}
	}
};