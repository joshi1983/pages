import { findFirstTokenToAlwaysHaltProcedure } from
'./findFirstTokenToAlwaysHaltProcedure.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isAfterOrSame } from
'../../generic-parsing-utilities/isAfterOrSame.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getFirst(tok1, tok2) {
	if (tok1 === undefined)
		return tok2;
	if (tok2 === undefined)
		return tok1;
	if (isAfterOrSame(tok1, tok2))
		return tok2;
	else
		return tok1;
}

function getPreliminaryLast(startToken, isLocalScope) {
	if (isLocalScope !== MaybeDecided.No) {
		const result = findFirstTokenToAlwaysHaltProcedure(startToken);
		if (result !== undefined) {
			return getSortedLastDescendentTokenOf(result);
		}
	}
}

export function getLastTokenForScope(cachedParseTree, startToken, variable, isLocalScope) {
	const procedure = startToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD ?
		undefined : getProcedureFromAnyTokenInProcedure(startToken);

	let last = getPreliminaryLast(startToken, isLocalScope);
	let activeScopes = variable.getScopesAt(startToken, procedure);
	if (procedure === undefined || isLocalScope === MaybeDecided.No) {
		if (activeScopes.length === 0) {
			// If this assignment is in a procedure that is never called, let the scope end at the end of the procedure.
			if (procedure !== undefined && cachedParseTree.getProcedureCallsByName(procedure.name).length === 0)
				return getFirst(last, procedure.getEndToken());

			return cachedParseTree.getLastToken();
		}
		else if (isLocalScope === MaybeDecided.No && procedure !== undefined) {
			return getFirst(last, procedure.getEndToken());
		}
	}
	else {
		activeScopes = activeScopes.filter(s => s.procedure !== undefined);
		if (activeScopes.length === 0)
			return getFirst(last, procedure.getEndToken());
	}
	return getFirst(last, activeScopes[0].toToken);
};