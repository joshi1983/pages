import { CommandCalls } from '../CommandCalls.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { isAfterOrSame } from '../../generic-parsing-utilities/isAfterOrSame.js';
import { isInProcedure } from '../isInProcedure.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

/*
This updates the possiblyUsedInAProcedure so we can rule out 
more global variable scopes from access in procedures.
*/
export function evaluatePossiblyUsedInProcedure(cachedParseTree, variables) {
	// get scopes not tied to a procedure
	const lastToken = cachedParseTree.getLastToken();
	const scopes = variables.getAllScopesAsArray().filter(scope => 
		scope.procedure === undefined &&
		scope.toToken !== lastToken);
	if (scopes.length > 0) {
		let fromToken, toToken; // full range
		scopes.forEach(function(scope) {
			if (fromToken === undefined || isAfterOrSame(fromToken, scope.fromToken))
				fromToken = scope.fromToken;
			if (toToken === undefined || isAfterOrSame(scope.toToken, toToken))
				toToken = scope.toToken;
		});
		// Filter tokens down to the possible range to reduce data size before 
		// checking if any of the tokens are within the scope ranges.
		const procedureCallTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
			filter(token => !CommandCalls.isCommandCall(token) &&
				isAfterOrSame(token, fromToken) &&
				isAfterOrSame(toToken, token) &&
				!isInProcedure(token));
		scopes.forEach(function(scope) {
			for (let i = 0; i < procedureCallTokens.length; i++) {
				const procCall = procedureCallTokens[i];
				if (isAfterOrSame(procCall, scope.fromToken) && isAfterOrSame(scope.toToken, procCall)) {
					return; // scope might have called a procedure.
				}
			}
			scope.possiblyUsedInAProcedure = false;
			// no procedure call is between its from and to tokens so this scope is definitely not used by a procedure.
		});
	}
};