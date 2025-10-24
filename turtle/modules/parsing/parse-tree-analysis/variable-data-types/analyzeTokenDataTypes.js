import { analyzeTokenTypesForProcedureCPROCs } from './variable-assignment-scopes/analyzeTokenTypesForProcedureCPROCs.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getOutputTypesForProcedureBasic } from './getOutputTypesForProcedureBasic.js';
import { getTokenDataTypesBasic } from './getTokenDataTypesBasic.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { getTokenTypesAdvanced } from './getTokenTypesAdvanced.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processTokenDataTypesFromMultipleVariableAssignmentScopes } from './processTokenDataTypesFromMultipleVariableAssignmentScopes.js';
import { shouldBeEvaluatedForDataTypes } from './shouldBeEvaluatedForDataTypes.js';

function processAdvancedPass(tokensRemaining, variables, result) {
	let somethingChanged = true;
	while (somethingChanged) {
		somethingChanged = false;
		tokensRemaining = tokensRemaining.filter(t => !result.has(t));
		for (let i = 0; i < tokensRemaining.length; i++) {
			const token = tokensRemaining[i];
			const types = getTokenTypesAdvanced(token, variables, result);
			if (types !== undefined) {
				somethingChanged = true;
				result.set(token, types);
			}
		}
	}
	return tokensRemaining;
}

export function analyzeTokenDataTypes(cachedParseTree, tokenValueMap, variables) {
	const procedures = cachedParseTree.getProceduresMap();
	const extraInfo = {
		'procedures': procedures
	};
	const result = getTokenDataTypesBasic(tokenValueMap, cachedParseTree, extraInfo, variables);
	for (const varReadToken of getTokensByType(cachedParseTree,
		ParseTreeTokenType.VARIABLE_READ)) {
		const variable = variables.getVariableByName(varReadToken.val.toLowerCase());
		if (variable === undefined)
			continue;
		const procedure = cachedParseTree.getProcedureAtToken(varReadToken);
		const scopes = variable.getScopesAt(varReadToken, procedure);
		if (scopes.length === 1) {
			const scope = scopes[0];
			result.set(varReadToken, scope.assignedTypes);
		}
	}
	let tokensRemaining = cachedParseTree.getAllTokens().
		filter(shouldBeEvaluatedForDataTypes(cachedParseTree, variables)).
		filter(t => !result.has(t));
	tokensRemaining = processAdvancedPass(tokensRemaining, variables, result);
	// compute data types for procedure calls.
	for (const [key, procedure] of procedures) {
		const types = getOutputTypesForProcedureBasic(procedure, result);
		const calls = cachedParseTree.getProcedureCallsByName(procedure.name);
		calls.forEach(function(callToken) {
			result.set(callToken, types);
		});
	}
	tokensRemaining = processAdvancedPass(tokensRemaining, variables, result);

	tokensRemaining.forEach(function(token) {
		const types = getTokenTypesBasic(token, false, extraInfo);
		if (types !== undefined)
			result.set(token, types);
	});
	processTokenDataTypesFromMultipleVariableAssignmentScopes(cachedParseTree, variables, result);
	analyzeTokenTypesForProcedureCPROCs(cachedParseTree, result);

	return result;
};