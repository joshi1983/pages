import { Command } from '../../../Command.js';
import { getSortedFirstTokenFromArray } from
'../../../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { isAfterOrSame } from
'../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();

const refCommands = new Set(Command.getCommandsWithVariableRefTypes().map(info => info.primaryName));
const conditionalCommandNames = new Set(['if', 'ifelse']);

function mightNotExecute(cachedParseTree, token) {
	while (token !== null) {
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(token.val);
			if (info !== undefined && conditionalCommandNames.has(info.primaryName))
				return true;
		}
		token = token.parentNode;
	}
	return false;
}

function isOfInterest(cachedParseTree) {
	const variables = cachedParseTree.getVariables();
	const variableNames = new Set(variables.variables.keys());
	const globalVariableNames = new Set(variables.getAllVariablesAsArray().
		filter(v => v.hasAGlobalScope()).map(v => v.name));
	return function(token) {
		if (!variableNames.has(token.val.toLowerCase()))
			return false;
		if (token.type === ParseTreeTokenType.STRING_LITERAL) {
			const parent = token.parentNode;
			if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
				return false;
			const info = Command.getCommandInfo(parent.val);
			if (info === undefined || info.primaryName === 'make' || info.primaryName === 'localmake')
				return false;
			if (!refCommands.has(info.primaryName))
				return false;
			const parameterIndex = parent.children.indexOf(token);
			const argInfo = info.args[parameterIndex];
			if (argInfo === undefined)
				return false;
			else if (argInfo.refTypes === undefined)
				return false;
		}
		const variable = variables.getVariableByName(token.val.toLowerCase());
		const proc = cachedParseTree.getProcedureAtToken(token);
		if (proc !== undefined) {
			if (proc.parameters.indexOf(token.val.toLowerCase()) !== -1)
				return false;
			if (globalVariableNames.has(token.val.toLowerCase()))
				return false;
			const scopesInProc = variable.getScopesArray().filter(scope => 
				scope.procedure !== undefined &&
				scope.procedure.name === proc.name);
			if (scopesInProc.length === 0)
				return false;
			const firstAssignToken = getSortedFirstTokenFromArray(scopesInProc.map(scope => scope.assignToken));
			if (isAfterOrSame(token, firstAssignToken))
				return false;
		}
		else {
			const globalScopes = variable.getScopesArray().filter(scope => 
				scope.procedure === undefined);
			if (globalScopes.length !== 0) {
				const firstAssignToken = getSortedFirstTokenFromArray(globalScopes.map(scope => scope.assignToken));
				if (isAfterOrSame(token, firstAssignToken))
					return false;
			}
		}
		if (mightNotExecute(cachedParseTree, token))
			return false;
		return true;
	};
}

export function getVariableReferencesNotInitiallyDefined(cachedParseTree) {
	const tokens = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.VARIABLE_READ
	]).filter(isOfInterest(cachedParseTree));
	return tokens;
};