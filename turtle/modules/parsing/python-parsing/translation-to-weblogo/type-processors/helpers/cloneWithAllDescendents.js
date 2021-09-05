import { ParseTreeToken } from '../../../ParseTreeToken.js';

/*
Note that this will not clone up the tree.
The return value's parentNode is null.

It deep clones the current token and all of its descendents.
*/
export function cloneWithAllDescendents(token) {
	const result = new ParseTreeToken(token.val, token.lineIndex, token.colIndex, token.type, token.originalString);
	for (let i = 0; i < token.children.length; i++) {
		result.appendChild(cloneWithAllDescendents(token.children[i]));
	}
	return result;
};