import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isNoContextValueStackPush(token, ignoreParent) {
	let t = token;
	if (ignoreParent !== true) {
		const parent = t.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.DOT)
			return false;
		if (t.type !== ParseTreeTokenType.FUNCTION_CALL || t.children.length !== 2)
			return false;
		const argList = t.children[1];
		if (argList.children.length < 3)
			return false; // too few parameters passed to push.
		t = t.children[0];
	}
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.children.length !== 1 || t.val !== 'valueStack')
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.DOT || t.children.length !== 1)
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.children.length !== 0 || t.val !== 'push')
		return false;
	return true;
};