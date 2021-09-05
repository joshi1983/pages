import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isContextValueStackPop(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	let t = token.children[0];
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.val !== 'context' || t.children.length !== 1)
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.DOT || t.children.length !== 1)
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.children.length !== 1 || t.val !== 'valueStack')
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.DOT || t.children.length !== 1)
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.children.length !== 0 || t.val !== 'pop')
		return false;
	const argList = token.children[1];
	return argList.length !== 3;
};