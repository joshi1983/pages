import { DataTypes } from '../../../data-types/DataTypes.js';
import { getLastDescendentTokenOf } from '../../../parse-tree-token/getLastDescendentTokenOf.js';
import { isAfterOrSame } from '../../../generic-parsing-utilities/isAfterOrSame.js';
import { isInProcedure } from '../../isInProcedure.js';
import { VariableAssignmentScope } from '../VariableAssignmentScope.js';

function getScopesFrom(token, variableName, variables, cachedParseTree) {
	const variable = variables.getVariableByName(variableName);
	if (variable === undefined)
		return [];
	const proc = cachedParseTree.getProcedureAtToken(token);
	return variable.getScopesAt(token, proc);
}

function unionTypesOrDefaultAllDataTypes(dataTypesArray) {
	if (dataTypesArray.length === 0)
		return new DataTypes('*');
	const result = new DataTypes();
	for (let i = 0; i < dataTypesArray.length; i++) {
		result.addTypes(dataTypesArray[i]);
	}
	return result;
}

function getProcOrDefault(procedures, defaultResult) {
	let result = procedures[0];
	for (let i = 1; i < procedures.length; i++) {
		if (result !== procedures[i])
			return defaultResult;
	}
	return result;
}

function getSingleValue(singleValues) {
	const singleValue = singleValues[0];
	for (let i = 1; i < singleValues.length; i++) {
		if (singleValue !== singleValues[i])
			return;
	}
	return singleValue;
}

function shouldToTokenBeAdjusted(scope, swapCall) {
	if (scope.procedure !== undefined)
		return true;
	if (!isInProcedure(swapCall))
		return true;
	return false;
}

export function addScopesForSwap(result, cachedParseTree) {
	const swapCalls = cachedParseTree.getCommandCallsByName('swap');
	if (swapCalls.length === 0)
		return;

	for (let i = 0; i < swapCalls.length; i++) {
		const swapCall = swapCalls[i];
		const children = swapCall.children;
		for (let childIndex = 0; childIndex < children.length; childIndex++) {
			const child = children[childIndex];
			if (child.isStringLiteral()) {
				const variable = result.getVariableByName(child.val.toLowerCase());
				if (variable !== undefined) {
					const proc = cachedParseTree.getProcedureAtToken(child);
					const scopes = variable.getScopesAt(swapCall, proc);
					let toToken = swapCall;
					for (let scopeIndex = 0; scopeIndex < scopes.length; scopeIndex++) {
						const scope = scopes[scopeIndex];
						if (isAfterOrSame(scope.toToken, toToken))
							toToken = scope.toToken;
						if (shouldToTokenBeAdjusted(scope, swapCall)) {
							scope.toToken = swapCall; // mark end of the scope.
						}
					}
					// create new scope.
					let fromToken = swapCall.nextSibling;
					if (fromToken === null)
						fromToken = getLastDescendentTokenOf(swapCall);
					const otherVarNameToken = children[(1 + childIndex) % 2];
					const otherVarScopes = getScopesFrom(swapCall, otherVarNameToken.val.toLowerCase(), result, cachedParseTree);
					const assignedTypes = unionTypesOrDefaultAllDataTypes(otherVarScopes.map(s => s.assignedTypes));
					const requiredTypes = unionTypesOrDefaultAllDataTypes(otherVarScopes.map(s => s.requiredTypes));
					const otherVarProc = getProcOrDefault(otherVarScopes.map(s => s.procedure), proc);
					const singleValue = getSingleValue(otherVarScopes.map(s => s.singleValue));
					const newScope = new VariableAssignmentScope(swapCall, fromToken, toToken, assignedTypes, requiredTypes, otherVarProc, false, singleValue);
					variable.addScope(newScope);
				}
			}
		}
	}
};