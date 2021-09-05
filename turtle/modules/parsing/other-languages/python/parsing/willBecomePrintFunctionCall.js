import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function willBecomePrintFunctionCall(token) {
	if (token.val !== 'print')
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR ||
	parent.type === ParseTreeTokenType.UNARY_OPERATOR)
		return false; // parent type indicates that "print" is treated as a variable name.

	if (parent.type === ParseTreeTokenType.TREE_ROOT ||
	parent.type === ParseTreeTokenType.CODE_BLOCK)
		return true;
	return true;
};