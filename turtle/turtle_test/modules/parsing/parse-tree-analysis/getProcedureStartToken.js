import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getProcedureStartToken(token) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return token;
		token = token.parentNode;
	}
};