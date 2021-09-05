import { Command } from
'../../../../Command.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isMutationCommand } from
'../../isMutationCommand.js';
import { mightContainProcedureCall } from
'./mightContainProcedureCall.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { commandToVarIndexMap } from
'../../setLastSingleValueTokens.js';

export const variableNotMutatedCommandNames = new Set([
	'queue'
]);

function handleForLoopSettings(settings, executionState) {
	const variableNameToken = settings.children[1];
	if (variableNameToken !== undefined &&
	variableNameToken.isStringLiteral())
		executionState.deleteAssociatedValueTokenFor(variableNameToken.val.toLowerCase());
}

function shouldCallVariableMutated(commandInfo) {
	if (variableNotMutatedCommandNames.has(commandInfo.primaryName))
		return false;

	return true;
}

export function forgetVariablesChangedInToken(token, executionState) {
	if (mightContainProcedureCall(token))
		executionState.forgetAllGlobalVariables();
	if (token.type === ParseTreeTokenType.LIST &&
	token.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.parentNode.val);
		if (info !== undefined && info.primaryName === 'for') {
			handleForLoopSettings(token, executionState);
			return;
		}
	}
	const descendents = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	for (const d of descendents) {
		const info = Command.getCommandInfo(d.val);
		if (info !== undefined) {
			if (isMutationCommand(info)) {
				const variableIndex = commandToVarIndexMap.get(info.primaryName);
				if (d.children.length > variableIndex &&
				d.children[variableIndex].isStringLiteral()) {
					const variableName = d.children[variableIndex].val.toLowerCase();
					if (shouldCallVariableMutated(info))
						executionState.variableMutated(variableName);
					const isGlobal = !executionState.localVariableNames.has(variableName) &&
						info.primaryName !== 'localmake';
					if (isGlobal) {
						executionState.globalVariables.delete(variableName);
					}
					else {
						executionState.localVariables.delete(variableName);
					}
				}
			}
			else if (info.primaryName === 'swap') {
				for (const child of d.children) {
					if (child.isStringLiteral()) {
						executionState.deleteAssociatedValueTokenFor(child.val.toLowerCase());
					}
				}
			}
			else if (info.primaryName === 'for') {
				const settings = d.children[0];
				handleForLoopSettings(settings, executionState);
			}
		}
	}
};