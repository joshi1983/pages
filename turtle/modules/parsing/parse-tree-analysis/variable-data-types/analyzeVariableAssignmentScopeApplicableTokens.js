import { Command } from '../../Command.js';
import { getInstructionListChildToken } from '../getInstructionListChildToken.js';
import { isAfterOrSame } from '../../generic-parsing-utilities/isAfterOrSame.js';
import { isInProcedure } from '../isInProcedure.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
let terminatingCommands = Command.getCommandsWithVariableRefTypes().map(info => info.primaryName).
	filter(name => name !== 'getProperty');
terminatingCommands.push('localmake', 'make');
terminatingCommands = new Set(terminatingCommands);

function getApplicableScopes(variable) {
	const result = [];
	const scopes = variable.scopes;
	for (let i = 1; i < scopes.length; i++) {
		if (scopes[i - 1].intersectsRangeWith(scopes[i])) {
			if (result.length === 0 || !result[result.length - 1].equals(scopes[i - 1]))
				result.push(scopes[i - 1]);
			result.push(scopes[i]);
		}
	}
	return result;
}

function getInitialToken(fromToken, assignToken) {
	if (fromToken.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD) {
		if (isInProcedure(assignToken)) {
			return getInstructionListChildToken(assignToken).nextSibling;
		}
		else
			return getInstructionListChildToken(fromToken).nextSibling;
	}
	if (isAfterOrSame(assignToken, fromToken)) {
		return getInstructionListChildToken(assignToken).nextSibling;
	}
	else {
		return getInstructionListChildToken(fromToken);
	}
}

function isTerminating(token, varName) {
	if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP && token.children.length > 1 &&
	token.children[0].isStringLiteral() && token.children[0].val.toLowerCase() === varName) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && terminatingCommands.has(info.primaryName)) {
			return true;
		}
	}
	for (let i = 0; i < token.children.length; i++) {
		const child = token.children[i];
		if (isTerminating(child, varName))
			return true;
	}
	return false;
}

function addAllDescendingTokens(tokenSet, token, variableName) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ &&
	token.val.toLowerCase() === variableName) {
		tokenSet.add(token);
	}
	for (let i = 0; i < token.children.length; i++) {
		const child = token.children[i];
		addAllDescendingTokens(tokenSet, child, variableName);
	}
}

export function analyzeVariableAssignmentScopeApplicableTokens(variables) {
	// Find variables where applicableTokens might be useful at filtering to 
	// the smallest non-empty set of possible scopes applicable to a given token.

	// Variables with only 1 scope won't benefit.

	// Since a token is either in a procedure or it is global, 
	//  - a variable must have at least 2 scopes global or
	//  - at least 2 scopes within a procedure
	// Otherwise, a single scope can be found.
	const applicableVariables = variables.getAllVariablesAsArray().
		filter(v => v.scopes.length > 1).
		filter(v =>
			v.scopes.filter(s => s.procedure === undefined).length > 1 ||
			v.scopes.filter(s => s.procedure !== undefined).length > 1);

	applicableVariables.forEach(function(variable) {
		const scopes = getApplicableScopes(variable);
		scopes.forEach(function(scope) {
			const variableName = scope.variable.name.toLowerCase();
			let token = getInitialToken(scope.fromToken, scope.assignToken);
			for (;
			token !== null && !isTerminating(token, variable.name);
			token = token.nextSibling) {
				if (token.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
					addAllDescendingTokens(scope.applicableTokens, token, variableName);
				}
			}
		});
	});
};