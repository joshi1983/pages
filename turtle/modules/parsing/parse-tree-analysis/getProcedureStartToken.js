import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getProcedureStartToken(token) {
	if (token === null)
		return undefined;
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return token;
	return getProcedureStartToken(token.parentNode);
};