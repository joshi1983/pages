import { isNoContextValueStackPush } from './isNoContextValueStackPush.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isContextValueStackPush(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const argList = token.children[1];
	if (argList.children.length < 3)
		return false; // too few parameters
	let t = token.children[0];
	if (t.type !== ParseTreeTokenType.IDENTIFIER || t.val !== 'context' || t.children.length !== 1)
		return false;
	t = t.children[0];
	if (t.type !== ParseTreeTokenType.DOT || t.children.length !== 1)
		return false;
	t = t.children[0];
	return isNoContextValueStackPush(t, true);
};