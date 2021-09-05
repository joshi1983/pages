import { ArrayUtils } from
'../../../../ArrayUtils.js';
import { Command } from
'../../../Command.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const listCloningNames = new Set(['butFirst', 'butLast', 'clone', 'lput', 'queue', 'rput']);
const listMutationNames = ['queue', 'queue2'];
const variableIndexes = new Map();

await Command.asyncInit();
for (const name of listMutationNames) {
	const info = Command.getCommandInfo(name);
	const index = ArrayUtils.indexOfMatch(info.args, argInfo => argInfo.refTypes !== undefined);
	if (index !== -1)
		variableIndexes.set(info.primaryName, index);
}

export { listMutationNames, listCloningNames };

function shouldScopeSingleValueBecomeUndefined(scope, calls, startAffectedVariableNames,
hasNoncloningMutation) {
	if (scope.variable === undefined)
		return false;

	const variableName = scope.variable.name;
	if (!hasNoncloningMutation &&
	!startAffectedVariableNames.has(variableName))
		return false;
	return true;
}

function mutationCallToVariableName(call) {
	const info = Command.getCommandInfo(call.val);
	const varIndex = variableIndexes.get(info.primaryName);
	const variableToken = call.children[varIndex];
	if (variableToken !== undefined &&
	variableToken.isStringLiteral())
		return variableToken.val.toLowerCase();
}

function mightBeAssignedFromAnotherVariableList(scope) {
	if (scope.isParameter)
		return true;
		// for example, myProc :myList could be passing a list from another variable.

	const assignToken = scope.assignToken;
	if (assignToken === null)
		return true;

	if (assignToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(assignToken.val);
		if (info !== undefined) {
			if (info.primaryName === 'swap')
				return true;
			if (info.primaryName === 'make' ||
			info.primaryName === 'localmake') {
				const valToken = assignToken.children[1];
				if (valToken.type === ParseTreeTokenType.LIST)
					return false;
				if (valToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
					const valCallInfo = Command.getCommandInfo(valToken.val);
					if (valCallInfo === undefined)
						return true;
						// without analysing the procedure call more deeply, it might be outputting another variable's value.
					else if (listCloningNames.has(valCallInfo.primaryName)) {
						return false;
					}
				}
			}
		}
	}

	return true;
}

function isNonCloningMutation(cachedParseTree, variables) {
	return function(call) {
		const info = Command.getCommandInfo(call.val);
		if (info.primaryName === 'queue')
			return false;

		// if the corresponding variable scope was assigned from a clone or list literal,
		// return false.
		const variableName = mutationCallToVariableName(call);
		if (variableName === undefined)
			return false;

		const variable = variables.getVariableByName(variableName);
		if (variable === undefined)
			return false;

		const procedure = cachedParseTree.getProcedureAtToken(call);
		const matchingScopes = variable.getScopesAt(call, procedure);
		if (!matchingScopes.some(mightBeAssignedFromAnotherVariableList))
			return false;

		return true;
	};
}

export function processMutationsOfSingleValueLists(cachedParseTree, variables) {
	const listScopes = variables.getAllScopesAsArray().filter(scope => scope.singleValue instanceof Array);
	if (listScopes.length === 0)
		return; // nothing to do here.

	const mutationCalls = cachedParseTree.getCommandCallsByNames(listMutationNames);
	if (mutationCalls.length === 0)
		return; // nothing to do here because a list value

	const hasNoncloningMutation = mutationCalls.some(isNonCloningMutation(cachedParseTree, variables));
	const startAffectedVariableNames = new Set(mutationCalls.map(mutationCallToVariableName));

	// can't be mutated by a queue2 if queue2 is never called.
	for (let i = 0; i < listScopes.length; i++) {
		const scope = listScopes[i];
		if (shouldScopeSingleValueBecomeUndefined(scope, mutationCalls,
		startAffectedVariableNames, hasNoncloningMutation)) {
			scope.singleValue = undefined;
		}
	}
};