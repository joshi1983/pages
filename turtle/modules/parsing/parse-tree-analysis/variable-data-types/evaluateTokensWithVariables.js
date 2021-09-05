import { ArrayUtils } from '../../../ArrayUtils.js';
import { Command } from '../../Command.js';
import { ForLoops } from '../ForLoops.js';
import { getTokenValueAdvanced } from './getTokenValueAdvanced.js';
import { mightQueue2MutateManyVariables } from './variable-assignment-scopes/mightQueue2MutateManyVariables.js';
import { setLastSingleValueTokens } from './setLastSingleValueTokens.js';
import { shouldBeEvaluatedAdvanced } from './shouldBeEvaluatedAdvanced.js';

function isForLoopVariableToken(assignToken) {
	return ForLoops.isAForLoopToken(assignToken);
}

function getAssignedValue(variableName, assignToken, tokenValueMap, variables, cachedParseTree) {
	const info = Command.getCommandInfo(assignToken.val);
	if (info === undefined)
		return undefined;
	if (info.primaryName === 'make' || info.primaryName === 'localmake')
		return tokenValueMap.get(assignToken.children[1]);
	if (info.primaryName === 'swap') {
		/*
		Let's try to get the value moved into the variable by the swap command.
		*/
		const childIndex = ArrayUtils.indexOfMatch(assignToken.children, (token) => token.isStringLiteral() && token.val.toLowerCase() === variableName);
		if (childIndex === -1)
			return;
		const otherVarNameToken = assignToken.children[(childIndex + 1) % 2];
		if (!otherVarNameToken.isStringLiteral())
			return;
		const otherVar = variables.getVariableByName(otherVarNameToken.val.toLowerCase());
		if (otherVar === undefined)
			return;
		const proc = cachedParseTree.getProcedureAtToken(assignToken);
		const scopes = otherVar.getScopesAt(assignToken, proc);
		if (scopes.length === 1)
			return scopes[0].singleValue;
	}
}

function updateSingleValues(varScopes, tokenValueMap, extraInfo, variables, cachedParseTree) {
	let result = false;
	for (let i = 0; i < varScopes.length; i++) {
		const scope = varScopes[i];
		if (scope.isUnsafeForSingleValueAssignment === true)
			continue;
		const val = getAssignedValue(scope.variable.name, scope.assignToken, tokenValueMap, variables, cachedParseTree);
		if (val !== undefined && extraInfo.isArraySingleValueRestricted !== true) {
			scope.setSingleValue(val, extraInfo);
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
		if (scope.isUnsafeForSingleValueAssignment === true)
			continue;
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

function updateTokenValuesUsingApplicableTokens(unevaluatedTokens, tokenValueMap, variables) {
	const scopesWithApplicableTokens = variables.getAllScopesAsArray().filter(scope => 
		scope.applicableTokens.size !== 0 &&
		scope.singleValue !== undefined);
	let result = false;
	for (let scope of scopesWithApplicableTokens) {
		for (let token of scope.applicableTokens) {
			if (!tokenValueMap.has(token)) {
				tokenValueMap.set(token, scope.singleValue);
				result = true;
			}
		}
	}
	return result;
}

function updateTokenValues(unevaluatedTokens, tokenValueMap, variables) {
	let result = false;
	if (updateTokenValuesUsingApplicableTokens(unevaluatedTokens, tokenValueMap, variables))
		result = true;

	for (let i = 0; i < unevaluatedTokens.length; i++) {
		const token = unevaluatedTokens[i];
		if (tokenValueMap.has(token))
			continue;
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
	let isArraySingleValueRestricted = mightQueue2MutateManyVariables(cachedParseTree, variables);
	let somethingChanged = true;
	let varScopes = variables.getAllScopesAsArray().filter(s => !isForLoopVariableToken(s.assignToken));
	let paramScopes = varScopes.filter(s => s.isParameter).filter(function(scope) {
		// We can't get a value for a parameter that is never called so filter these parameters out.
		return cachedParseTree.getProcedureCallsByName(scope.procedure.name).length !== 0;
	});
	varScopes = varScopes.filter(s => !s.isParameter);
	let unevaluatedTokens = cachedParseTree.getAllTokens().filter(shouldBeEvaluatedAdvanced);
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap(),
		'isArraySingleValueRestricted': isArraySingleValueRestricted
	};
	while (somethingChanged) {
		somethingChanged = false;
		paramScopes = paramScopes.filter(s => s.singleValue === undefined);
		if (updateSingleValueParameters(cachedParseTree, paramScopes, basicTokenValuesMap))
			somethingChanged = true;
		varScopes = varScopes.filter(s => s.singleValue === undefined);
		if (updateSingleValues(varScopes, basicTokenValuesMap, extraInfo, variables, cachedParseTree))
			somethingChanged = true;
		unevaluatedTokens = unevaluatedTokens.filter(t => !basicTokenValuesMap.has(t));
		if (updateTokenValues(unevaluatedTokens, basicTokenValuesMap, variables))
			somethingChanged = true;
	}
};