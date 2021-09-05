import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isEndFillCall(token) {
	return token.type === ParseTreeTokenType.FUNCTION_CALL &&
		token.val === 'end_fill';
};