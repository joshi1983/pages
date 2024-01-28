import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isNoContextValueStackElement(token) {
	if (token.type !== ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION ||
	token.children.length !== 2)
		return false;
	let tok = token.children[0];
	if (tok.type !== ParseTreeTokenType.IDENTIFIER || tok.val !== 'valueStack' || tok.children.length !== 0)
		return false;
	tok = token.children[1];
	if (tok.type !== ParseTreeTokenType.INDEX_EXPRESSION || tok.children.length !== 3)
		return false;
	return true;
};