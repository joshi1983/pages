import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { ForLoops } from '../ForLoops.js';
import { getAllVariableAssigningTokens } from './getAllVariableAssigningTokens.js';
import { getLastTokenForScope } from './getLastTokenForScope.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { getVariableScopeStart } from './getVariableScopeStart.js';
import { isLocalAssignmentToken } from './isLocalAssignmentToken.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { shouldScopeBeReduced } from './shouldScopeBeReduced.js';
import { VariableScope } from './VariableScope.js';

function getFirstTokenAfterCommandToken(commandToken) {
	if (commandToken.nextSibling !== null)
		return commandToken.nextSibling;
	else if (commandToken.parentNode !== null)
		return getFirstTokenAfterCommandToken(commandToken.parentNode);
	else
		return commandToken.getLastToken();
}

function processToken(cachedParseTree, variables, token) {
	let procedure = getProcedureFromAnyTokenInProcedure(token);
	const info = Command.getCommandInfo(token.val);
	let assignToken, fromToken, varName, types;
	if (info.primaryName === 'for' && token.children.length === 2) {
		varName = ForLoops.getVariableName(token);
		types = new DataTypes(ForLoops.getDataTypeWithForLoop(token));
		fromToken = ForLoops.getInstructionListToken(token);
	}
	else if (info.primaryName === 'localmake' || info.primaryName === 'make') {
		varName = token.children[0].val.toLowerCase();
		types = getTokenTypesBasic(token.children[1], true, {
			'procedures': cachedParseTree.getProceduresMap()
		});
		if (types === undefined)
			types = new DataTypes(DataTypes.getAllAssignableDataTypes());
		else
			types = new DataTypes(types);
		fromToken = getFirstTokenAfterCommandToken(token);
	}
	if (fromToken !== undefined) {
		const variable = variables.getVariableByName(varName);
		let isLocalScope = isLocalAssignmentToken(token, procedure, variable);
		if (isLocalScope === MaybeDecided.No)
			procedure = undefined;
		const toToken = getLastTokenForScope(cachedParseTree, fromToken, variable, isLocalScope);
		const newScope = new VariableScope(token, fromToken, toToken, types,
			new DataTypes(DataTypes.getAllAssignableDataTypes()), procedure, false);
		const existingScopes = isLocalScope === MaybeDecided.Yes ?
			variable.getLocalScopesAt(fromToken, procedure) :
			variable.getScopesAt(fromToken, procedure);
		const newEnd = cachedParseTree.getTokenImmediatelyBefore(fromToken);
		existingScopes.filter(s => shouldScopeBeReduced(cachedParseTree, s, newEnd)).forEach(s => s.toToken = newEnd);
		newScope.fromToken = getVariableScopeStart(cachedParseTree, newScope.fromToken);
		variable.addScope(newScope);
	}
}

export function addVariableAssignmentScopes(cachedParseTree, variables) {
	const tokens = getAllVariableAssigningTokens(cachedParseTree, variables);
	const nonMakeTokens = [];
	const makeTokens = [];
	tokens.forEach(function(tok) {
		if (CommandCalls.tokenMatchesPrimaryName(tok, 'make'))
			makeTokens.push(tok);
		else
			nonMakeTokens.push(tok);
	});
	nonMakeTokens.forEach(function(token) {
		processToken(cachedParseTree, variables, token);
	});
	// Since 'make' can create global variables even when called within procedures, do it last.
	// Doing it last will help isLocalAssignmentToken return more accurate results.
	makeTokens.forEach(function(token) {
		processToken(cachedParseTree, variables, token);
	});
};