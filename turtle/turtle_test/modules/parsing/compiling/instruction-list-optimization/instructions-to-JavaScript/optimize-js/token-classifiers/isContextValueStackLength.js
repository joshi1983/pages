import { isNoContextValueStackLength } from './isNoContextValueStackLength.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isContextValueStackLength(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'context' || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT || token.val !== '.' || token.children.length !== 1)
		return false;
	token = token.children[0];
	return isNoContextValueStackLength(token, true);
};