import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

const vals = ['context', '.', 'math', '.', 'not'];

export function isNotToken(token) {
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
	token.val === '!')
		return true;
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	for (let i = 0; i < vals.length; i++) {
		token = token.children[0];
		if (token === undefined || vals[i] !== token.val || token.children.length > 1)
			return false;
		const type = token.type;
		if (type !== ParseTreeTokenType.IDENTIFIER &&
		type !== ParseTreeTokenType.DOT)
			return false;
	}
	return token.children.length === 0;
};
