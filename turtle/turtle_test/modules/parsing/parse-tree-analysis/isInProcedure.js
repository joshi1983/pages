import { getProcedureStartToken } from './getProcedureStartToken.js';

// token should be a ParseTreeToken or null.
export function isInProcedure(token) {
	return getProcedureStartToken(token) !== undefined;
};