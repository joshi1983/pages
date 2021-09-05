import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getElseChild(token) {
	for (const child of token.children) {
		if (child.type === ParseTreeTokenType.ELSE)
			return child;
	}
	return null; // indicate not found
};