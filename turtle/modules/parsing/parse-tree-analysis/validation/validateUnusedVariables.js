import { binarySearch } from '../../../binarySearch.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { compareParseTokens } from '../compareParseTokens.js';
import { getParseTokensSorted } from '../../getParseTokensSorted.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure } from '../../Procedure.js';

const refCommandNames = Command.getCommandsWithVariableRefTypes().map(info => info.primaryName);

function getNumber(val) {
	if (typeof val === 'number')
		return val;
	else
		return Math.max(0, val.failingAtIndex);
}

function tokenToVariableName(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return token.val.toLowerCase();
	else if (token.children.length >= 1 && token.children[0].isStringLiteral())
		return token.children[0].val.toLowerCase();
}

function isStrictlyVariableReadToken(token) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return true;
	else {
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === 'getProperty')
			return true;
	}
	return false;
}

class VariableReadTokenProcedurePair {
	constructor(token, procedure) {
		this.token = token;
		this.procedure = procedure;
	}
};

export function validateUnusedVariables(cachedParseTree, parseLogger) {
	const variables = cachedParseTree.getVariables();
	const lastToken = cachedParseTree.getLastToken();
	const proceduresStrictlyFromTree = cachedParseTree.getProcedureNamesStrictlyFromTree();
	let varReadTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
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
	const scopes = variables.getAllScopesAsArray().filter(function(scope) {
		// We don't care about global variable scopes that apply after the code halts normally.
		if (scope.toToken === lastToken && scope.procedure === undefined)
			return false;
		// we don't want to validate procedures that are not in the same parse tree.
		// This is useful for procedures defined in the Code Editor but when we're running from the Commander.
		if (scope.procedure !== undefined && !proceduresStrictlyFromTree.has(scope.procedure.name))
			return false;
		// important for property lists:
		if (CommandCalls.tokenMatchesPrimaryName(scope.toToken, 'setProperty'))
			return false;
		if (varReadTokens.length === 0)
			return true;
		let fromIndex = binarySearch(varReadTokens, compareParseTokens, scope.fromToken, true);
		let toIndex = Math.min(varReadTokens.length - 1, binarySearch(varReadTokens, compareParseTokens, scope.toToken, true));
		for (let i = fromIndex; i <= toIndex; i++) {
			const tokenPair = varReadTokens[i];
			const varName = tokenToVariableName(tokenPair.token);
			if (varName === scope.variable.name) {
				// If the variable is not a parameter, only a variable read matters.
				if (!isStrictlyVariableReadToken(tokenPair.token) && !scope.isParameter)
					continue;
				if (scope.contains(tokenPair.token, tokenPair.procedure))
					return false;
			}
		}
		return true;
	});
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