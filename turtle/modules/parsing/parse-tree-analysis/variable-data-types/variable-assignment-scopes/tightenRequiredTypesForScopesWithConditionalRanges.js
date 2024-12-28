import { DataTypes } from
'../../../data-types/DataTypes.js';
import { getRequiredTypesFromStart } from
'./required-types/getRequiredTypesFromStart.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await DataTypes.asyncInit();

function isScopeOfInterest(scope) {
	if (scope.conditionalRanges.length === 0)
		return false;
	return true;
}

export function tightenRequiredTypesForScopesWithConditionalRanges(cachedParseTree, variables, tokenTypesMap) {
	const scopesOfInterest = variables.getAllScopesAsArray().filter(isScopeOfInterest);
	for (const scope of scopesOfInterest) {
		const [u, i] = getRequiredTypesFromStart(cachedParseTree, 
		scope.variable.name, scope.assignToken, tokenTypesMap, new DataTypes('*'));
		scope.requiredTypes = new DataTypes(DataTypes.union(u.types, i.types));
	}
};