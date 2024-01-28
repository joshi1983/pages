import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function usesSubscript(token) {
	if (token.children.length === 1 && token.children[0].type === ParseTreeTokenType.SUBSCRIPT)
		return true; // for example list1[4] where list1 === token.val.
	return false;
};