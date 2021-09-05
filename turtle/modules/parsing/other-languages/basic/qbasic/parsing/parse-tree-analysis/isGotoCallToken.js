import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isGotoCallToken(token) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const childChildren = token.children;
		const firstChild = childChildren[0];
		if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.IDENTIFIER &&
		firstChild.val.toLowerCase() === 'goto' &&
		childChildren.length === 2)
			return true;
	}
	return false;
};