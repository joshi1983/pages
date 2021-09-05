import { ArrayUtils } from '../../../ArrayUtils.js';
import { Command } from '../../Command.js';
import { compareTokenLocations } from '../../parse-tree-token/compareTokenLocations.js';
import { filterVariableScopesDeclaredAt } from '../variable-data-types/variable-assignment-scopes/filterVariableScopesDeclaredAt.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { isMutationCommand } from '../variable-data-types/isMutationCommand.js';
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

function isVariableRead(token) {
	return token.type === ParseTreeTokenType.VARIABLE_READ;
}

/*
make and localmake could be considered variable references in general but
they're excluded for the needs of looking for "undeclared" variables.
make and localmake declare variables.
*/
function isVariableReference(token) {
	if (!token.isStringLiteral() || token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const parentInfo = Command.getCommandInfo(token.parentNode.val);
	if (parentInfo === undefined || !isMutationCommand(parentInfo) ||
	parentInfo.primaryName === 'make' ||
	parentInfo.primaryName === 'localmake')
		return false;
	const argIndex = token.parentNode.children.indexOf(token);
	if (parentInfo.args.length <= argIndex)
		return false;
	return parentInfo.args[argIndex].refTypes !== undefined;
}

function getVariableReferenceTokens(cachedParseTree) {
	return cachedParseTree.getTokensByTypes([ParseTreeTokenType.STRING_LITERAL, ParseTreeTokenType.LONG_STRING]).
		filter((token) => isVariableReference(token));
}

export function validateUndeclaredVariableRead(cachedParseTree, parseLogger) {
	let variableRefTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).filter(function(token) {
		return !Procedure.isParameterToken(token);
	});
	ArrayUtils.pushAll(variableRefTokens, getVariableReferenceTokens(cachedParseTree));
	if (variableRefTokens.length === 0)
		return; // No need to process any more.
	const variables = cachedParseTree.getVariables();
	variableRefTokens.forEach(function(variableRefToken) {
		const varName = variableRefToken.val.toLowerCase();
		if (varName === '')
			return; // Don't give error messages about reading an empty variable name before assigning.
		const procedure = cachedParseTree.getProcedureAtToken(variableRefToken);
		const variable = variables.getVariableByName(varName);
		let scopes = variable === undefined ? [] : variable.getScopesAt(variableRefToken, procedure);
		if (variable !== undefined && scopes.length === 0 && procedure === undefined) {
			// find any global variable scopes.
			scopes = variable.getScopesArray().filter(s => s.procedure === undefined &&
				compareTokenLocations(s.assignToken, variableRefToken) < 0 &&
				s.assignTokenProcedure === undefined
			);
		}
		if (variable !== undefined && !isVariableRead(variableRefToken) && scopes.length === 0)
			scopes = filterVariableScopesDeclaredAt(cachedParseTree, variable.scopes, variableRefToken);
		if (scopes.length === 0 || (scopes.length === 1 && assignmentContainsToken(scopes[0], variableRefToken))) {
			if (isVariableRead(variableRefToken)) {
				if (procedure === undefined)
					parseLogger.error(`Variable "${varName}" not assigned a value before reading`, variableRefToken);
				else {
					parseLogger.error(`Variable "${varName}" not assigned a value before reading in procedure ${procedure.name}`, variableRefToken);
				}
			}
			else {
				if (procedure === undefined)
					parseLogger.error(`Variable "${varName}" not assigned a value before referencing`, variableRefToken);
				else {
					parseLogger.error(`Variable "${varName}" not assigned a value before referencing in procedure ${procedure.name}`, variableRefToken);
				}
			}
		}
	});
};