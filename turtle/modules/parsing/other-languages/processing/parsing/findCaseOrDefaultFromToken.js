import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function findCaseOrDefaultFromToken(token) {
	for (let i = 0; i < 3 && token !== null; i++) {
		if (token.type === ParseTreeTokenType.CASE ||
		token.type === ParseTreeTokenType.DEFAULT) {
			return token;
		}
		token = token.parentNode;
	}
	return null;
};