import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function shouldAppendChild(prev, next) {
	if (prev.type === ParseTreeTokenType.BINARY_OPERATOR &&
	prev.children.length < 2)
		return true;
	if (prev.type === ParseTreeTokenType.UNARY_OPERATOR &&
	prev.children.length === 0)
		return true;
	return false;
};