import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isBeginFillCall(token) {
	return token.type === ParseTreeTokenType.FUNCTION_CALL &&
		token.val === 'begin_fill';
};
