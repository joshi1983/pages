import { ForLoops } from '../ForLoops.js';
import { getTokenValueAdvanced } from './getTokenValueAdvanced.js';
import { setLastSingleValueTokens } from './setLastSingleValueTokens.js';
import { shouldBeEvaluatedAdvanced } from './shouldBeEvaluatedAdvanced.js';

function isForLoopVariableToken(assignToken) {
	return ForLoops.isAForLoopToken(assignToken);
}

function updateSingleValues(varScopes, tokenValueMap, extraInfo) {
	let result = false;
	for (let i = 0; i < varScopes.length; i++) {
		const scope = varScopes[i];
		const valToken = scope.assignToken.children[1];
		const val = tokenValueMap.get(valToken);
		if (val !== undefined) {
			scope.setSingleValue(val, extraInfo);
			tokenValueMap.set(valToken, val);
			result = true;
		}
	}
	return result;
}

function updateSingleValueParameters(cachedParseTree, paramScopes, tokenValueMap) {
	let result = false;
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	for (let i = 0; i < paramScopes.length; i++) {
		const scope = paramScopes[i];
		const procedure = scope.procedure;
		const parameterIndex = procedure.parameters.indexOf(scope.variable.name);
		const callTokens = cachedParseTree.getProcedureCallsByName(procedure.name);
		let valueToMatch = tokenValueMap.get(callTokens[callTokens.length - 1].children[parameterIndex]);
		let allMatched = valueToMatch !== undefined;
		if (allMatched) {
			// Check that all calls to the procedure specify the same value for the particular parameter.
			for (let j = callTokens.length - 2; j >= 0; j--) {
				const callToken = callTokens[j];
				const val = tokenValueMap.get(callToken.children[parameterIndex]);
				if (val === undefined || val !== valueToMatch) {
					allMatched = false;
					break;
				}
			}
		}
		if (allMatched) {
			scope.setSingleValue(valueToMatch, extraInfo);
			result = true;
		}
	}
	return result;
}

function updateTokenValues(unevaluatedTokens, tokenValueMap, variables) {
	let result = false;
	for (let i = 0; i < unevaluatedTokens.length; i++) {
		const token = unevaluatedTokens[i];
		const val = getTokenValueAdvanced(token, tokenValueMap, variables);
		if (val !== undefined) {
			tokenValueMap.set(token, val);
			result = true;
		}
	}
	return result;
}

export function evaluateTokensWithVariables(cachedParseTree, basicTokenValuesMap, variables) {
	setLastSingleValueTokens(cachedParseTree, variables);
	let somethingChanged = true;
	let varScopes = variables.getAllScopesAsArray().filter(s => !isForLoopVariableToken(s.assignToken));
	let paramScopes = varScopes.filter(s => s.isParameter).filter(function(scope) {
		// We can't get a value for a parameter that is never called so filter these parameters out.
		return cachedParseTree.getProcedureCallsByName(scope.procedure.name).length !== 0;
	});
	varScopes = varScopes.filter(s => !s.isParameter);
	let unevaluatedTokens = cachedParseTree.getAllTokens().filter(shouldBeEvaluatedAdvanced);
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	while (somethingChanged) {
		somethingChanged = false;
		paramScopes = paramScopes.filter(s => s.singleValue === undefined);
		if (updateSingleValueParameters(cachedParseTree, paramScopes, basicTokenValuesMap))
			somethingChanged = true;
		varScopes = varScopes.filter(s => s.singleValue === undefined);
		if (updateSingleValues(varScopes, basicTokenValuesMap, extraInfo))
			somethingChanged = true;
		unevaluatedTokens = unevaluatedTokens.filter(t => !basicTokenValuesMap.has(t));
		if (updateTokenValues(unevaluatedTokens, basicTokenValuesMap, variables))
			somethingChanged = true;
	}
};