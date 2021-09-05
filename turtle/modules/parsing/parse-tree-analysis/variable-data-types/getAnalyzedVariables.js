import { addConditionalRangesToScopes } from './variable-assignment-scopes/addConditionalRangesToScopes.js';
import { addScopesForParameters } from './variable-assignment-scopes/addScopesForParameters.js';
import { addScopesForPropertyLists } from './variable-assignment-scopes/addScopesForPropertyLists.js';
import { addScopesForSwap } from './variable-assignment-scopes/addScopesForSwap.js';
import { addVariableAssignmentScopes } from './variable-assignment-scopes/addVariableAssignmentScopes.js';
import { addVariablesFromInitialVariables } from './addVariablesFromInitialVariables.js';
import { adjustSubtypesForLists } from './variable-assignment-scopes/adjustSubtypesForLists.js';
import { analyzeTokenBasic } from './analyzeTokenBasic.js';
import { analyzeTokenDataTypes } from './analyzeTokenDataTypes.js';
import { analyzeVariableAssignmentScopeApplicableTokens } from
'./analyzeVariableAssignmentScopeApplicableTokens.js';
import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { evaluatePossiblyUsedInProcedure } from './evaluatePossiblyUsedInProcedure.js';
import { evaluateTokensBasic } from './evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from './evaluateTokensWithVariables.js';
import { getAllVariables } from './getAllVariables.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processRequiredTypeParameters } from './processRequiredTypeParameters.js';
import { propogateSwappedValues } from './variable-assignment-scopes/propogateSwappedValues.js';
import { tightenGlobalVariableAssignmentScopesAssignedInProcedure } from
'./global-variables/tightenGlobalVariableAssignmentScopesAssignedInProcedure.js';
import { tightenTokenDataTypesAfterAdjustSubtypesForLists } from
'./variable-assignment-scopes/tightenTokenDataTypesAfterAdjustSubtypesForLists.js';
import { tightenRequiredTypesForScopesWithConditionalRanges } from
'./variable-assignment-scopes/tightenRequiredTypesForScopesWithConditionalRanges.js';
import { updateAssignTokenProcedureForVariableAssignmentScopes } from
'./updateAssignTokenProcedureForVariableAssignmentScopes.js';
await Command.asyncInit();
await DataTypes.asyncInit();

function tightenTypes(cachedParseTree, variables) {
	const basicTokenValuesMap = evaluateTokensBasic(cachedParseTree);
	evaluateTokensWithVariables(cachedParseTree, basicTokenValuesMap, variables);
	addScopesForPropertyLists(variables, cachedParseTree, basicTokenValuesMap);
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	const tokenToTypes = analyzeTokenDataTypes(cachedParseTree, basicTokenValuesMap, variables);
	variables.getAllScopesAsArray().forEach(function(scope) {
		if (scope.singleValue !== undefined)
			scope.assignedTypes = DataTypes.getTypesCompatibleWithValue(scope.singleValue, extraInfo);
		else {
			const assignToken = scope.assignToken;
			if (assignToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				const info = Command.getCommandInfo(assignToken.val);
				if (info !== undefined) {
					if (info.primaryName === 'localmake' || info.primaryName === 'make') {
						const types = tokenToTypes.get(assignToken.children[1]);
						if (types !== undefined)
							scope.assignedTypes = types;
					}
				}
			}
			else if (scope.isParameter) {
				const proc = scope.procedure;
				const paramIndex = proc.parameters.indexOf(scope.variable.name);
				const callTokens = cachedParseTree.getProcedureCallsByName(proc.name);
				const assignTypes = new DataTypes();
				callTokens.forEach(function(callToken) {
					if (callToken.children.length > paramIndex) {
						const types = tokenToTypes.get(callToken.children[paramIndex]);
						if (types !== undefined)
							assignTypes.addTypes(types);
					}
				});
				scope.assignedTypes = assignTypes;
			}
		}
	});
	processRequiredTypeParameters(cachedParseTree, tokenToTypes, variables);
	adjustSubtypesForLists(cachedParseTree, variables, tokenToTypes);
	tightenTokenDataTypesAfterAdjustSubtypesForLists(cachedParseTree, variables, tokenToTypes);
}

export function getAnalyzedVariables(cachedParseTree) {
	// add all variables and formal parameters.
	const result = getAllVariables(cachedParseTree);
	addVariablesFromInitialVariables(cachedParseTree, result);
	addScopesForParameters(result, cachedParseTree);
	addVariableAssignmentScopes(cachedParseTree, result);
	addScopesForSwap(result, cachedParseTree);

	addConditionalRangesToScopes(cachedParseTree, result.getAllScopesAsArray());
	updateAssignTokenProcedureForVariableAssignmentScopes(cachedParseTree.getProceduresMap(), result);
	tightenGlobalVariableAssignmentScopesAssignedInProcedure(cachedParseTree, result);
	analyzeVariableAssignmentScopeApplicableTokens(result);
	evaluatePossiblyUsedInProcedure(cachedParseTree, result);
	analyzeTokenBasic(cachedParseTree.root, cachedParseTree, result, undefined);
	tightenRequiredTypesForScopesWithConditionalRanges(cachedParseTree, result);
	propogateSwappedValues(cachedParseTree, result);

	tightenTypes(cachedParseTree, result);

	return result;
};