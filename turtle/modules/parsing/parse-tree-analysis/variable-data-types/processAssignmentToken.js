import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { ForLoops } from '../ForLoops.js';
import { getLastTokenForScope } from './getLastTokenForScope.js';
import { getTokenTypesBasic } from './getTokenTypesBasic.js';
import { getVariableAssignmentScopeStart } from './variable-assignment-scopes/getVariableAssignmentScopeStart.js';
import { isLocalAssignmentToken } from './isLocalAssignmentToken.js';
import { MaybeDecided } from '../../../MaybeDecided.js';
import { processRequiredTypes } from './processRequiredTypes.js';
import { SetUtils } from '../../../SetUtils.js';
import { shouldScopeBeReduced } from './variable-assignment-scopes/shouldScopeBeReduced.js';
import { VariableAssignmentScope } from './VariableAssignmentScope.js';

function getFirstTokenAfterCommandToken(commandToken) {
	if (commandToken.nextSibling !== null)
		return commandToken.nextSibling;
	else if (commandToken.parentNode !== null)
		return getFirstTokenAfterCommandToken(commandToken.parentNode);
	else
		return commandToken.getLastToken();
}

export function processAssignmentToken(cachedParseTree, variables, token) {
	let procedure = cachedParseTree.getProcedureAtToken(token);
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
		const newScope = new VariableAssignmentScope(token, fromToken, toToken, types,
			new DataTypes(DataTypes.getAllAssignableDataTypes()), procedure, false);
		const existingScopes = isLocalScope === MaybeDecided.Yes ?
			variable.getLocalScopesAt(fromToken, procedure) :
			variable.getScopesAt(fromToken, procedure);
		const newEnd = cachedParseTree.getTokenImmediatelyBefore(fromToken);
		existingScopes.filter(s => shouldScopeBeReduced(cachedParseTree, s, newEnd)).
			forEach(s => s.toToken = newEnd);
		const applicableTokens = new Set();
		newScope.fromToken = getVariableAssignmentScopeStart(cachedParseTree, fromToken,
			newScope.assignToken, applicableTokens, variable.name);
		if (procedure === undefined)
			newScope.assignTokenProcedure = cachedParseTree.getProcedureAtToken(newScope.assignToken);
		SetUtils.addAll(newScope.applicableTokens, applicableTokens);
		applicableTokens.forEach(function(applicableToken) {
			processRequiredTypes(applicableToken, newScope.requiredTypes, variables, newScope.procedure);
		});
		variable.addScope(newScope);
		return newScope;
	}
};