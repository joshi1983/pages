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
import { getTokenDataTypesBasic } from './getTokenDataTypesBasic.js';
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
import { updateAssignedTypesForParameters } from
'./variable-assignment-scopes/updateAssignedTypesForParameters.js';
await Command.asyncInit();
await DataTypes.asyncInit();

function tightenTypes(cachedParseTree, variables) {
	const basicTokenValuesMap = evaluateTokensBasic(cachedParseTree);
	function log(prefix) {
		const x = variables.getVariableByName('x');
		if (x !== undefined) {
			let scopeDetails = '';
			if (x.scopes.length !== 0) {
				const scope = x.scopes[x.scopes.length - 1];
				scopeDetails = `assignedTypes=${scope.assignedTypes}, requiredTypes=${scope.requiredTypes}`;
			}
			console.log(`tightenTypes after ${prefix} x.scopes.length=${x.scopes.length}, x.scopes[last] details: ${scopeDetails}`);
		}
	}
	evaluateTokensWithVariables(cachedParseTree, basicTokenValuesMap, variables);
	log(`evaluateTokensWithVariables`);

	addScopesForPropertyLists(variables, cachedParseTree, basicTokenValuesMap);
	log(`addScopesForPropertyLists`);

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
	log(`processRequiredTypeParameters`);

	adjustSubtypesForLists(cachedParseTree, variables, tokenToTypes);
	log(`adjustSubtypesForLists`);

	tightenTokenDataTypesAfterAdjustSubtypesForLists(cachedParseTree, variables, tokenToTypes);
	log(`tightenTokenDataTypesAfterAdjustSubtypesForLists`);

	return tokenToTypes;
}

export function getAnalyzedVariables(cachedParseTree) {
	// add all variables and formal parameters.
	const result = getAllVariables(cachedParseTree);
	function log(prefix) {
		const x = result.getVariableByName('x');
		if (x !== undefined) {
			let scopeDetails = '';
			if (x.scopes.length !== 0) {
				const scope = x.scopes[x.scopes.length - 1];
				scopeDetails = `assignedTypes=${scope.assignedTypes}, requiredTypes=${scope.requiredTypes}`;
			}
			console.log(`after ${prefix} x.scopes.length=${x.scopes.length}, x.scopes[last] details: ${scopeDetails}`);
		}
	}
	
	addVariablesFromInitialVariables(cachedParseTree, result);
	log('addVariablesFromInitialVariables');

	const tokenValuesBasic = evaluateTokensBasic(cachedParseTree);
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	const tokenTypesBasic = getTokenDataTypesBasic(tokenValuesBasic, cachedParseTree, extraInfo, result);
	addScopesForParameters(result, cachedParseTree, tokenTypesBasic);
	log('addScopesForParameters');

	addVariableAssignmentScopes(cachedParseTree, result);
	log('addVariableAssignmentScopes');

	addScopesForSwap(result, cachedParseTree);
	log('addScopesForSwap');

	addConditionalRangesToScopes(cachedParseTree, result.getAllScopesAsArray());
	log('addConditionalRangesToScopes');

	updateAssignTokenProcedureForVariableAssignmentScopes(cachedParseTree.getProceduresMap(), result);
	log('updateAssignTokenProcedureForVariableAssignmentScopes');

	tightenGlobalVariableAssignmentScopesAssignedInProcedure(cachedParseTree, result);
	log('tightenGlobalVariableAssignmentScopesAssignedInProcedure');

	analyzeVariableAssignmentScopeApplicableTokens(result);
	log('tightenGlobalVariableAssignmentScopesAssignedInProcedure');

	evaluatePossiblyUsedInProcedure(cachedParseTree, result);
	log('evaluatePossiblyUsedInProcedure');

	analyzeTokenBasic(cachedParseTree.root, cachedParseTree, result, undefined);
	log('analyzeTokenBasic');

	tightenRequiredTypesForScopesWithConditionalRanges(cachedParseTree, result);
	log('tightenRequiredTypesForScopesWithConditionalRanges');

	propogateSwappedValues(cachedParseTree, result);
	log('propogateSwappedValues');

	const tokenToTypes = tightenTypes(cachedParseTree, result);
	log('tightenTypes');

	updateAssignedTypesForParameters(cachedParseTree, result, tokenToTypes);
	log('updateAssignedTypesForParameters');
	console.log('##########################################################');

	return result;
};