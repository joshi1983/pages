import { assignTokenToValueToken } from './assignTokenToValueToken.js';
import { clearTokenMapAround } from '../clearTokenMapAround.js';
import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { getTokenTypesAdvanced } from '../getTokenTypesAdvanced.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { unionDataTypesArray } from '../../../data-types/unionDataTypesArray.js';

export function tightenTokenDataTypesAfterAdjustSubtypesForLists(cachedParseTree, variables, tokenDataTypes) {
	const allScopes = variables.getAllScopesAsArray();
	const scopes = allScopes.
	filter(s => s.isUnsafeForSingleValueAssignment === true);
	if (scopes.length === 0)
		return;
	const varNames = new Set();
	scopes.forEach(scope => varNames.add(scope.variable.name) && scope.assignedTypes !== undefined);
	const varReadsOfInterest = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
		filter(token => varNames.has(token.val.toLowerCase()));
	if (varReadsOfInterest.length === 0)
		return;
	const allAffectedTokens = new Set();
	varReadsOfInterest.forEach(function(varReadToken) {
		const variable = variables.getVariableByName(varReadToken.val.toLowerCase());
		const procedure = cachedParseTree.getProcedureAtToken(varReadToken);
		const scopes = variable.getScopesAt(varReadToken, procedure);
		const newTypes = unionDataTypesArray(scopes.map(s => s.assignedTypes));
		tokenDataTypes.set(varReadToken, newTypes);
		const affectedTokens = new Map();
		clearTokenMapAround(tokenDataTypes, varReadToken, affectedTokens);
		for (const token of affectedTokens.keys()) {
			const newTypes = getTokenTypesAdvanced(token, variables, tokenDataTypes);
			if (newTypes !== undefined && !newTypes.equals(affectedTokens.get(token))) {
				tokenDataTypes.set(token, newTypes);
				allAffectedTokens.add(token);
			}
		}
	});
	for (let i = 0; i < allScopes.length; i++) {
		const scope = allScopes[i];
		if (scope.isUnsafeForSingleValueAssignment === true)
			continue;
		const valueToken = assignTokenToValueToken(scope.assignToken);
		if (valueToken !== undefined) {
			const newTypes = getTokenTypesAdvanced(valueToken, variables, tokenDataTypes);;
			if (newTypes !== undefined) {
				scope.assignedTypes = newTypes;
			}
		}
	}
};