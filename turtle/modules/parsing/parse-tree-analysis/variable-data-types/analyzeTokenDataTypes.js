import { analyzeTokenTypesForProcedureCPROCs } from './variable-assignment-scopes/analyzeTokenTypesForProcedureCPROCs.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getOutputTypesForProcedureBasic } from './getOutputTypesForProcedureBasic.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { getTokenTypesAdvanced } from './getTokenTypesAdvanced.js';
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
	const result = new Map();
	const procedures = cachedParseTree.getProceduresMap();
	const extraInfo = {
		'procedures': procedures
	};
	// compute data types off known token values.
	for (const [key, value] of tokenValueMap) {
		result.set(key, DataTypes.getTypesCompatibleWithValue(value, extraInfo));
	}
	let tokensRemaining = cachedParseTree.getAllTokens().
		filter(shouldBeEvaluatedForDataTypes(cachedParseTree, variables)).
		filter(t => !result.has(t));
	tokensRemaining.forEach(function(token) {
		const types = getTokenTypesBasic(token, true, extraInfo);
		if (types !== undefined)
			result.set(token, types);
	});
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