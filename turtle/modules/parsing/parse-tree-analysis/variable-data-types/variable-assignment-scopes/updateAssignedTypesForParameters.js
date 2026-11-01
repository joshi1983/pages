import { getAssignedDataTypesForParameter } from
'./getAssignedDataTypesForParameter.js';

export function updateAssignedTypesForParameters(cachedParseTree, variables, tokenTypesMap) {
	const parameterScopes = variables.getAllScopesAsArray().
		filter(scope => scope.isParameter === true && scope.conditionalRanges.length !== 0);
	for (const scope of parameterScopes) {
		scope.assignedTypes = getAssignedDataTypesForParameter(cachedParseTree, scope, tokenTypesMap);
	}
};