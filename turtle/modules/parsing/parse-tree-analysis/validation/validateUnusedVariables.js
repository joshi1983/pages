import { binarySearch } from '../../../binarySearch.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { compareParseTokens } from '../compareParseTokens.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { isMutationCommand } from '../variable-data-types/isMutationCommand.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure } from '../../Procedure.js';
import { validateIdentifier } from '../validateIdentifier.js';

const refCommandNames = Command.getCommandsWithVariableRefTypes().map(info => info.primaryName);
const primaryNameToVarIndex = new Map();
refCommandNames.forEach(function(primaryName) {
	const info = Command.getCommandInfo(primaryName);
	let index;
	for (index = 0; index < info.args.length && info.args[index].refTypes === undefined; index++);
	primaryNameToVarIndex.set(info.primaryName, index);
});

function getNumber(val) {
	if (typeof val === 'number')
		return val;
	else
		return Math.max(0, val.failingAtIndex);
}

function tokenToVariableName(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return token.val.toLowerCase();
	else if (token.children.length > 0) {
		const info = Command.getCommandInfo(token.val);
		const variableIndex = primaryNameToVarIndex.get(info.primaryName);
		if (token.children.length > variableIndex) {
			const child = token.children[variableIndex];
			if (child.isStringLiteral())
				return child.val.toLowerCase();
		}
	}
}

function isStrictlyVariableReadToken(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.primaryName === 'getProperty')
			return true;
	}
	return false;
}

function isMutationToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	// queue does not mutate an existing instance.
	// It creates a new instance with the updated value.
	if (info.primaryName === 'queue')
		return false;
	return isMutationCommand(info);
}

function mightAffectOtherVariable(assignToken) {
	if (assignToken.type === ParseTreeTokenType.LIST) {
		if (assignToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return true;
			// scope corresponds with a parameter so it might be tied to another variable.
	}
	const info = Command.getCommandInfo(assignToken.val);
	if (info === undefined)
		return false;
	if (assignToken.children.length === 2 && (info.primaryName === 'localmake' || info.primaryName === 'make')) {
		const fromToken = assignToken.children[1];
		const fromTokens = getAllDescendentsAsArray(fromToken);
		fromTokens.push(fromToken);
		return fromTokens.some(isStrictlyVariableReadToken);
	}
	else if (info.primaryName === 'for')
		return false; // for-loop variables are numbers.  They can't mutate other variables.
	return true;
}

class VariableReadTokenProcedurePair {
	constructor(token, procedure) {
		this.token = token;
		this.procedure = procedure;
	}
};

/*
If a scope is ended by a swap command that swaps scope.variable with another variable,
we're not interested in validating it here.
Since the swap command references the variable scope, the scope is considered "used".
*/
function isScopeEndedBySwapThatUsesIt(scope) {
	const toToken = scope.toToken;
	if (toToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(toToken.val);
	if (info === undefined || info.primaryName !== 'swap')
		return false;
	const variableName = scope.variable.name;
	return toToken.children.some(c => c.isStringLiteral() && c.val.toLowerCase() === variableName);
}

function isScopeOfInterest(varReadTokens, lastToken, proceduresStrictlyFromTree) {
	return function(scope) {
		// If the identifier is invalid, other validators will point that out and they'll be more important.
		if (validateIdentifier(scope.variable.name) !== undefined)
			return false;

		// We don't care about global variable scopes that apply after the code halts normally.
		if (scope.toToken === lastToken && scope.procedure === undefined)
			return false;
		if (scope.assignTokenProcedure !== undefined && scope.procedure === undefined)
			return false;
		// we don't want to validate procedures that are not in the same parse tree.
		// This is useful for procedures defined in the Code Editor but when we're running from the Commander.
		if (scope.procedure !== undefined && !proceduresStrictlyFromTree.has(scope.procedure.name))
			return false;
		// important for property lists:
		if (CommandCalls.tokenMatchesPrimaryName(scope.toToken, 'setProperty'))
			return false;
		if (isScopeEndedBySwapThatUsesIt(scope))
			return false;
		if (varReadTokens.length === 0)
			return true;
		const fromOtherVariable = mightAffectOtherVariable(scope.assignToken);
		let fromIndex = binarySearch(varReadTokens, compareParseTokens, scope.fromToken, true);
		let toIndex = Math.min(varReadTokens.length - 1, binarySearch(varReadTokens, compareParseTokens, scope.toToken, true));
		for (let i = fromIndex; i <= toIndex; i++) {
			const tokenPair = varReadTokens[i];
			const varName = tokenToVariableName(tokenPair.token);
			if (varName === scope.variable.name) {
				if (fromOtherVariable === true && isMutationToken(tokenPair.token))
					return false;
				// If the variable is not a parameter, only a variable read matters.
				if (scope.isParameter === false && isStrictlyVariableReadToken(tokenPair.token) === false)
					continue;
				if (scope.contains(tokenPair.token, tokenPair.procedure))
					return false;
			}
		}
		return true;
	}
}

export function validateUnusedVariables(cachedParseTree, parseLogger) {
	const variables = cachedParseTree.getVariables();
	const lastToken = cachedParseTree.getLastToken();
	const proceduresStrictlyFromTree = cachedParseTree.getProcedureNamesStrictlyFromTree();
	let varReadTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
		filter(t => !Procedure.isParameterToken(t));
	const refTypeCommandCalls = cachedParseTree.getCommandCallsByNames(refCommandNames).
		filter(token => typeof tokenToVariableName(token) === 'string');
	if (refTypeCommandCalls.length !== 0) {
		varReadTokens = varReadTokens.concat(refTypeCommandCalls);
	}
	getParseTokensSorted(varReadTokens);
	varReadTokens = varReadTokens.map(function(token) {
		return new VariableReadTokenProcedurePair(token, cachedParseTree.getProcedureAtToken(token));
	});
	const scopes = variables.getAllScopesAsArray().filter(isScopeOfInterest(varReadTokens, lastToken, proceduresStrictlyFromTree));
	scopes.forEach(function(scope) {
		let msg;
		if (scope.isParameter)
			msg = `The initial value of parameter ${scope.variable.name} is never read.`;
		else if (scope.procedure !== undefined)
			msg = `Local variable ${scope.variable.name} in procedure ${scope.procedure.name} is assigned a value that is never read.`;
		else
			msg = `Global variable ${scope.variable.name} is assigned a value that is never read.`;
		parseLogger.warn(msg, scope.assignToken);
	});
};