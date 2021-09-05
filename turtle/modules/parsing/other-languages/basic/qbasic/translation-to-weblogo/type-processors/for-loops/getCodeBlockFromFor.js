import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getCodeBlockFromFor(token) {
	const children = token.children;
	for (const child of children) {
		if (child.type === ParseTreeTokenType.CODE_BLOCK)
			return child;
	}
};