import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isNoContextValueStackLength(token, ignoreParent) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'valueStack' || token.children.length !== 1)
		return false;
	if (ignoreParent !== true) {
		const parent = token.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.DOT)
			return false;
	}
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT || token.val !== '.' || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'length')
		return false;
	if (token.children.length !== 0) {
		const child = token.children[0];
		if (child.type !== ParseTreeTokenType.UNARY_OPERATOR)
			return false;
		if (child.val !== '--' && child.val !== '++')
			return false;
	}
	return true;
};