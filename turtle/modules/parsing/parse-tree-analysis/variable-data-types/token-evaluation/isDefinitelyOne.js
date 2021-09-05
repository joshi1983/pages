import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isDefinitelyOne(token) {
	return token.type === ParseTreeTokenType.NUMBER_LITERAL &&
	token.val === 1;
};
