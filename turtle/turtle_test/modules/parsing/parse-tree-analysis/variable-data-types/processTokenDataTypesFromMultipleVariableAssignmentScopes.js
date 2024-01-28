import { DataTypes } from '../../data-types/DataTypes.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function processTokenDataTypesFromMultipleVariableAssignmentScopes(cachedParseTree, variables, tokenTypesMap) {
	const varNamesOfInterest = new Set();
	for (const [name, variable] of variables.variables) {
		if (variable.scopes.length > 1) {
			varNamesOfInterest.add(name);
		}
	}
	if (varNamesOfInterest.size > 0) {
		const varReadTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
			filter(token => varNamesOfInterest.has(token.val.toLowerCase()));
		varReadTokens.forEach(function(varReadToken) {
			const variable = variables.getVariableByName(varReadToken.val);
			const procedure = cachedParseTree.getProcedureAtToken(varReadToken);
			const scopes = variable.getScopesAt(varReadToken, procedure);
			if (scopes.length > 1) {
				const types = new DataTypes();
				scopes.forEach(function(scope) {
					types.addTypes(scope.assignedTypes);
				});
				tokenTypesMap.set(varReadToken, types);
			}
		});
	}
};