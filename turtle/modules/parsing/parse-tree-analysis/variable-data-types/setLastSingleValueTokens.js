import { Command } from '../../Command.js';
import { compareParseTokens } from '../compareParseTokens.js';
import { getLastSingleValueTokenForScope } from './getLastSingleValueTokenForScope.js';
import { loadCommandToVarIndexes, mutatingCommandsArray } from './isMutationCommand.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
await Command.asyncInit();
await ParseTreeToken.asyncInit();

const commandToVarIndexMap = new Map([['localmake', 0], ['make', 0]]);
loadCommandToVarIndexes(commandToVarIndexMap);

class MutationPoint {
	constructor(varName, token) {
		this.varName = varName;
		this.token = token;
	}
}

function isSafeForCommandCallToMutationPoint(callToken) {
	const info = Command.getCommandInfo(callToken.val);
	const index = commandToVarIndexMap.get(info.primaryName);
	const tokenVal = callToken.children[index].val;
	return typeof tokenVal === 'string';
}

function commandCallToMutationPoint(callToken) {
	const info = Command.getCommandInfo(callToken.val);
	const index = commandToVarIndexMap.get(info.primaryName);
	const tokenVal = callToken.children[index].val;
	if (typeof tokenVal !== 'string')
		throw new Error(`Unable to get mutation point because a token val is unexpectedly not a string.  val="${tokenVal}" This is associated with command ${info.primaryName}`);
	const varName = tokenVal.trim().toLowerCase();
	const token = ParseTreeToken.getLastDescendentTokenOf(callToken);
	return new MutationPoint(varName, token);
}

export function setLastSingleValueTokens(cachedParseTree, variables) {
	const mutateCalls = cachedParseTree.getCommandCallsByNames(mutatingCommandsArray);
	const mutationPoints = mutateCalls.filter(call => isSafeForCommandCallToMutationPoint(call)).map(commandCallToMutationPoint);
	mutationPoints.forEach(function(mutationPoint) {
		const token = mutationPoint.token;
		const procedure = cachedParseTree.getProcedureAtToken(token);
		const variable = variables.getVariableByName(mutationPoint.varName, procedure);
		if (variable !== undefined) {
			let applicableScopes = variable.getScopesAt(token, procedure);
			applicableScopes = applicableScopes.filter(scope => (compareParseTokens(token, scope.assignToken) > 0));
			applicableScopes = applicableScopes.filter(scope => scope.lastSingleValueToken === undefined ||
				compareParseTokens(scope.lastSingleValueToken, token) > 0);
			applicableScopes.forEach(function(scope) {
				let newToken = getLastSingleValueTokenForScope(scope, token, cachedParseTree);
				if (scope.lastSingleValueToken === undefined ||
				compareParseTokens(newToken, scope.lastSingleValueToken) < 0)
					scope.lastSingleValueToken = newToken;
			});
		}
	});
};