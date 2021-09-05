import { getProcedureStartToken } from '../getProcedureStartToken.js';
import { tokenToProcedure } from '../tokenToProcedure.js';

export function getProcedureFromAnyTokenInProcedure(token) {
	if (!token)
		throw new Error('token must be a ParseTreeToken.  Not: ' + token);
	const procStartToken = getProcedureStartToken(token);
	if (procStartToken !== null && procStartToken.children.length < 2)
		return undefined;
	return procStartToken === null ? undefined : tokenToProcedure(procStartToken);
};