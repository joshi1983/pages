import { DataTypes } from
'../../../data-types/DataTypes.js';
import { getRequiredTypesForForSettingsToken } from
'./getRequiredTypesForForSettingsToken.js';
import { intersectRequiredTypesForBinaryOperatorToken } from
'./intersectRequiredTypesForBinaryOperatorToken.js';
import { intersectRequiredTypesForParameterizedGroupToken } from
'./intersectRequiredTypesForParameterizedGroupToken.js';
import { intersectRequiredTypesForUnaryOperatorToken } from
'./intersectRequiredTypesForUnaryOperatorToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await DataTypes.asyncInit();

function isScopeOfInterest(scope) {
	if (scope.conditionalRanges.length === 0)
		return false;
	return true;
}

export function getDataTypesForScopeOutsideOfConditionalRanges(cachedParseTree, scope) {
	const result = new DataTypes('*');
	const varName = scope.variable.name;
	const tokens = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.PARAMETERIZED_GROUP,
		ParseTreeTokenType.UNARY_OPERATOR,
		ParseTreeTokenType.VARIABLE_READ
	]).filter(token => scope.contains(token, scope.procedure) &&
	scope.getConditionalRangeAt(token) === undefined);

	for (const token of tokens) {
		if (token.type === ParseTreeTokenType.VARIABLE_READ &&
		token.val.toLowerCase() === varName) {
			const typesString = getRequiredTypesForForSettingsToken(token);
			if (typeof typesString === 'string') {
				result.intersectWith(new DataTypes(typesString));
			}
		}
		else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			intersectRequiredTypesForParameterizedGroupToken(token, varName, result);
		}
		else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
			intersectRequiredTypesForUnaryOperatorToken(token, varName, result);
		}
		else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
			intersectRequiredTypesForBinaryOperatorToken(token, varName, result);
		}
	}
	return result;
};

export function getDataTypesForScopeWithConditionalRanges(cachedParseTree, scope) {
	const result = new DataTypes();
	// add all the satisfying types of conditional ranges.
	for (const range of scope.conditionalRanges)
		result.addTypes(range.satisfyingDataTypes);

	result.addTypes(getDataTypesForScopeOutsideOfConditionalRanges(cachedParseTree, scope));
	return result;
};

export function tightenRequiredTypesForScopesWithConditionalRanges(cachedParseTree, variables) {
	const scopesOfInterest = variables.getAllScopesAsArray().filter(isScopeOfInterest);
	for (const scope of scopesOfInterest) {
		const types = getDataTypesForScopeWithConditionalRanges(cachedParseTree, scope);
		scope.requiredTypes.intersectWith(types);
	}
};