import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function getLastTokenForScope(cachedParseTree, startToken, variable, isLocalScope) {
	const procedure = startToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD ?
		undefined : getProcedureFromAnyTokenInProcedure(startToken);
	let activeScopes = variable.getScopesAt(startToken, procedure);
	if (procedure === undefined || isLocalScope === MaybeDecided.No) {
		if (activeScopes.length === 0) {
			// If this assignment is in a procedure that is never called, let the scope end at the end of the procedure.
			if (procedure !== undefined && cachedParseTree.getProcedureCallsByName(procedure.name).length === 0)
				return procedure.getEndToken();

			return cachedParseTree.getLastToken();
		}
	}
	else {
		activeScopes = activeScopes.filter(s => s.procedure !== undefined);
		if (activeScopes.length === 0)
			return procedure.getEndToken();
	}
	return activeScopes[0].toToken;
};