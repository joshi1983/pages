import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure } from '../../Procedure.js';

function assignmentContainsToken(scope, token) {
	if (token === null)
		return false;
	else if (token === scope.assignToken) {
		if (typeof token.val === 'string') {
			const info = Command.getCommandInfo(token.val);
			if (info.primaryName === 'make' || info.primaryName === 'localmake')
				return true;
		}
		return false;
	}
	else
		return assignmentContainsToken(scope, token.parentNode);
}

export function validateUndeclaredVariableRead(cachedParseTree, parseLogger) {
	let variableReadTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).filter(function(token) {
		return !Procedure.isParameterToken(token);
	});
	if (variableReadTokens.length === 0)
		return; // No need to process any more.
	const variables = cachedParseTree.getVariables();
	const variableReadTokensToRemove = new Set();
	variableReadTokens.forEach(function(variableReadToken) {
		const varName = variableReadToken.val.toLowerCase();
		if (varName === '')
			return; // Don't give error messages about reading an empty variable name before assigning.
		const procedure = cachedParseTree.getProcedureAtToken(variableReadToken);
		const variable = variables.getVariableByName(varName);
		const scopes = variable === undefined ? [] : variable.getScopesAt(variableReadToken, procedure);
		if (scopes.length === 0 || (scopes.length === 1 && assignmentContainsToken(scopes[0], variableReadToken))) {
			if (procedure === undefined)
				parseLogger.error(`Variable "${varName}" not assigned a value before reading`, variableReadToken);
			else {
				parseLogger.error(`Variable "${varName}" not assigned a value before reading in procedure ${procedure.name}`, variableReadToken);
			}
			variableReadTokensToRemove.add(variableReadToken);
		}
	});
};