import { addSubtypes } from '../../../data-types/addSubtypes.js';
import { ArrayUtils } from '../../../../ArrayUtils.js';
import { assignTokenToValueToken } from './assignTokenToValueToken.js';
import { Command } from '../../../Command.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();
const listType = new DataTypes('list');
const primaryNameToVariableNameIndex = new Map();
const primaryNameToValueIndex = new Map();
// dequeue, dequeue are not of interest because they don't affect the known subtypes.
const commandsOfInterest = ['queue', 'queue2', 'setItem'];
commandsOfInterest.forEach(function(commandName) {
	const info = Command.getCommandInfo(commandName);
	let index = ArrayUtils.indexOfMatch(info.args, (argInfo) => argInfo.refTypes === undefined);
	primaryNameToValueIndex.set(info.primaryName, index);
	index = ArrayUtils.indexOfMatch(info.args, (argInfo) => argInfo.refTypes !== undefined && (
		argInfo.types === 'string' || argInfo.types.indexOf('list') !== -1));
	primaryNameToVariableNameIndex.set(info.primaryName, index);
});

function getElementValueTokenFromCall(callToken) {
	const commandInfo = Command.getCommandInfo(callToken.val);
	const index = primaryNameToValueIndex.get(commandInfo.primaryName);
	if (index >= callToken.children.length)
		return undefined;
	else
		return callToken.children[index];
}

function getVariableNameTokenFromCall(callToken) {
	const commandInfo = Command.getCommandInfo(callToken.val);
	const index = primaryNameToVariableNameIndex.get(commandInfo.primaryName);
	if (index >= callToken.children.length)
		return undefined;
	else {
		const result = callToken.children[index];
		if (result.isStringLiteral() || result.type === ParseTreeTokenType.VARIABLE_READ)
			return result;
	}
}

function isCallOfInterest(tokenTypesMap) {
	return function(callToken) {
		const token = getElementValueTokenFromCall(callToken);
		if (token === undefined)
			return false;
		const tokenTypes = tokenTypesMap.get(token);
		if (tokenTypes === undefined)
			return false;
			/*  Is this right?  Maybe undefined means it could be any data type. */

		return true;
	};
}

function assignedFromEmptyList(scope) {
	const valueToken = assignTokenToValueToken(scope.assignToken);
	if (valueToken === undefined)
		return false;
	return valueToken.type === ParseTreeTokenType.LIST &&
		valueToken.children.length === 2;
}

function clearSubtypesFromList(dataTypes) {
	for (const type of dataTypes.types) {
		if (type.name === 'list' && type.subtypes === undefined) {
			type.subtypes = new DataTypes(); // empty set of types
		}
	}
}

function isScopeOfInterest(scope) {
	if (scope.assignedTypes === undefined)
		return false;
	if (!scope.assignedTypes.hasIntersectionWith(listType))
		return false;
	for (const type of scope.assignedTypes.types) {
		if (type.name === 'list' && type.subtypes === undefined && !assignedFromEmptyList(scope))
			return false;
	}
	return true;
}

export function adjustSubtypesForLists(cachedParseTree, variables, tokenTypesMap) {
	const calls = cachedParseTree.getCommandCallsByNames(commandsOfInterest).
	filter(isCallOfInterest(tokenTypesMap));
	if (calls.length === 0)
		return; // nothing to adjust.

	const callProcMap = new Map();
	calls.forEach(function(callToken) {
		const proc = cachedParseTree.getProcedureAtToken(callToken);
		callProcMap.set(callToken, proc);
	});
	const scopes = variables.getAllScopesAsArray().filter(isScopeOfInterest);
	scopes.forEach(function(scope) {
		const subtypes = new DataTypes();
		calls.forEach(function(callToken) {
			const proc = callProcMap.get(callToken);
			if (scopes.length > 1) {
				// the callToken might not be applicable to the current scope.
				const variableNameToken = getVariableNameTokenFromCall(callToken);
				if (variableNameToken !== undefined) {
					if (variableNameToken.val.toLowerCase() !== scope.variable.name)
						return;
					// don't do anything with this becau
				}
			}
			if (scope.contains(callToken, proc)) {
				// get the types
				const valueToken = getElementValueTokenFromCall(callToken);
				const types = tokenTypesMap.get(valueToken);
				subtypes.addTypes(types);
			}
		});
		scope.singleValue = undefined; // indicate the scope isn't connected to just 1 single value.
		scope.isUnsafeForSingleValueAssignment = true;
		// prevent evaluateTokensWithVariables from setting singleValue.

		if (!subtypes.isEmpty()) {
			if (assignedFromEmptyList(scope)) {
				clearSubtypesFromList(scope.assignedTypes);
			}
			addSubtypes(scope.assignedTypes, subtypes);
		}
	});
};