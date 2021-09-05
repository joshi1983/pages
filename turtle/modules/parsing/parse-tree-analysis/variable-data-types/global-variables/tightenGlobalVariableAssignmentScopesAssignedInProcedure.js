import { Command } from '../../../Command.js';
import { getDescendentsOfType } from '../../../parse-tree-token/getDescendentsOfType.js';
import { getParseTokensSorted } from '../../../parse-tree-token/getParseTokensSorted.js';
import { getTokensByType } from '../../cached-parse-tree/getTokensByType.js';
import { isAfterOrSame } from '../../../parse-tree-token/isAfterOrSame.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

function findFirstMatchingVariableReadInProcedure(fromToken, proc) {
	const varReads = getDescendentsOfType(proc.getInstructionListToken(), ParseTreeTokenType.VARIABLE_READ).
		filter(token => isAfterOrSame(token, fromToken));
	if (varReads.length > 1)
		getParseTokensSorted(varReads);
	return varReads[0];
}

/*
Global variable scopes are generally accessible to any procedure regardless of the 
fromToken and toToken but the fromToken is still used for determining if a global variable scope is 
applicable from a variable read outside of any procedure.

tightenGlobalVariableAssignmentScopesAssignedInProcedure updates the fromToken for global scopes 
to line up with the first possible call to the procedure containing its assignToken.
*/
export function tightenGlobalVariableAssignmentScopesAssignedInProcedure(cachedParseTree, variables) {
	const globalScopes = variables.getAllScopesAsArray().
		filter(scope => scope.procedure === undefined && scope.assignTokenProcedure !== undefined);
	if (globalScopes.length === 0)
		return;
	const affectedVariableNames = new Set(globalScopes.map(scope => scope.variable.name));
	const varReadTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
		filter(vt => affectedVariableNames.has(vt.val.toLowerCase()) && cachedParseTree.getProcedureAtToken(vt) === undefined);
	if (varReadTokens.length === 0)
		return;
	const procsGraph = cachedParseTree.getProcedureCallGraph();
	const procCallTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => Command.getCommandInfo(token.val) === undefined &&
			cachedParseTree.getProcedureAtToken(token) === undefined);
	if (procCallTokens.length > 1) {
		getParseTokensSorted(procCallTokens);
	}
	globalScopes.forEach(function(scope) {
		const proc = scope.assignTokenProcedure;
		const procsToFind = new Set(Array.from(procsGraph.getProceduresCalling(proc)).filter(proc => proc !== 'undefined'));
		procsToFind.add(proc.name);
		const globalProcCalls = procCallTokens.filter(token => procsToFind.has(token.val.toLowerCase()));
		if (globalProcCalls.length === 0) {
			scope.isGlobalAccessible = false;
			let newFromToken = scope.toToken;
			const firstMatchingVarRead = findFirstMatchingVariableReadInProcedure(scope.fromToken, proc);
			if (firstMatchingVarRead !== undefined) {
				newFromToken = firstMatchingVarRead;
			}
			scope.fromToken = newFromToken;
			// shrink the range to practically nothing since 
			// the scope has no effect at the global level.
		}
		else {
			let token = globalProcCalls[0];
			if (token.nextSibling !== null)
				token = token.nextSibling;
			scope.fromToken = token;
		}
	});
};