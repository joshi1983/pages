import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isDefinitelyZero(token) {
	return token.type === ParseTreeTokenType.NUMBER_LITERAL &&
	token.val === 0;
};