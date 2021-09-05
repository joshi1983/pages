import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToConditionToken(forToken) {
	const children = forToken.children;
	let j = 0;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (j === 1)
				return child;
			j++;
		}
	}
};