import { addScopesForParameters } from './addScopesForParameters.js';
import { addScopesForPropertyLists } from './addScopesForPropertyLists.js';
import { addVariableAssignmentScopes } from './addVariableAssignmentScopes.js';
import { addVariablesFromInitialVariables } from './addVariablesFromInitialVariables.js';
import { analyzeTokenBasic } from './analyzeTokenBasic.js';
import { analyzeTokenDataTypes } from './analyzeTokenDataTypes.js';
import { analyzeVariableScopeApplicableTokens } from './analyzeVariableScopeApplicableTokens.js';
import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { evaluatePossiblyUsedInProcedure } from './evaluatePossiblyUsedInProcedure.js';
import { evaluateTokensBasic } from './evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from './evaluateTokensWithVariables.js';
import { getAllVariables } from './getAllVariables.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processRequiredTypeParameters } from './processRequiredTypeParameters.js';
import { tightenGlobalVariableScopesAssignedInProcedure } from './tightenGlobalVariableScopesAssignedInProcedure.js';
import { updateAssignTokenProcedureForVariableScopes } from './updateAssignTokenProcedureForVariableScopes.js';
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
}

export function getAnalyzedVariables(cachedParseTree) {
	// add all variables and formal parameters.
	const result = getAllVariables(cachedParseTree);
	addVariablesFromInitialVariables(cachedParseTree, result);
	addScopesForParameters(result, cachedParseTree);
	addVariableAssignmentScopes(cachedParseTree, result);
	updateAssignTokenProcedureForVariableScopes(cachedParseTree.getProceduresMap(), result);
	tightenGlobalVariableScopesAssignedInProcedure(cachedParseTree, result);
	analyzeVariableScopeApplicableTokens(result);
	evaluatePossiblyUsedInProcedure(cachedParseTree, result);
	analyzeTokenBasic(cachedParseTree.root, cachedParseTree, result, undefined);

	tightenTypes(cachedParseTree, result);

	return result;
};