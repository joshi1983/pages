import { clearLocalVariablesModifiedInProcedureCall } from
'./clearLocalVariablesModifiedInProcedureCall.js';
import { Command } from
'../../../../Command.js';
import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getProcedureStartToken } from
'../../../getProcedureStartToken.js';
import { isDefinitelyEndingTheInstructionList } from
'./isDefinitelyEndingTheInstructionList.js';
import { mightContainProcedureCall } from
'./mightContainProcedureCall.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { simulateAssignment } from
'./simulateAssignment.js';
import { simulateToken } from
'./simulateToken.js';
import { tokenToProcedure } from
'../../../tokenToProcedure.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';

function forgetVariablesChangedInTokenChildren(parentToken, executionState) {
	for (const child of parentToken.children) {
		forgetVariablesChangedInToken(child, executionState);
	}
}

function shouldEquateEarly(call) {
	if (Command.getCommandInfo(call.val) !== undefined)
		return false; // we know some other token must be a procedure call.
		// no need to run getDescendentsOfType.

	const descendents = getDescendentsOfType(call, ParseTreeTokenType.PARAMETERIZED_GROUP);
	if (descendents.some(d => d !== call && Command.getCommandInfo(d.val) === undefined))
		return false;
	return true;
}

export function processInstructionList(token, result,
executionState, procedureGlobalEffects) {
	if (typeof executionState !== 'object')
		throw new Error(`executionState must be an object and more specifically a SimulatedExecutionState but found ${executionState}`);

	const procStart = getProcedureStartToken(token);
	const isInProcedure = procStart !== null;
	if (isInProcedure) {
		// copy parameter names into localVariableNames.
		const procedure = tokenToProcedure(procStart);
		for (const parameter of procedure.parameters) {
			executionState.localVariableNames.add(parameter);
		}
	}
	for (let child of token.children) {
		child = unwrapCurvedBracketExpressions(child);
		if (child.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				if (mightContainProcedureCall(child)) {
					const globalEffects = procedureGlobalEffects.procs.get(child.val.toLowerCase());
					if (globalEffects !== undefined) {
						if (shouldEquateEarly(child))
							processAllVariableReadsAsEqualities(child, result, executionState);
						executionState.forgetAffectedVariables(globalEffects, procedureGlobalEffects);
					}
				}
				let simulated = false;
				if (simulateToken(child, result, executionState, procedureGlobalEffects))
					simulated = true;

				if (isDefinitelyEndingTheInstructionList(child, result))
					return;

				if (simulated)
					continue;
				const info = Command.getCommandInfo(child.val);
				if (info === undefined ||
				info.primaryName === 'make' ||
				info.primaryName === 'localmake') {
					forgetVariablesChangedInTokenChildren(child, executionState);
					if (info === undefined) {
						clearLocalVariablesModifiedInProcedureCall(
							child, executionState, procedureGlobalEffects);
					}
				}
				else
					forgetVariablesChangedInToken(child, executionState);

				processAllVariableReadsAsEqualities(child, result, executionState);
				if (info !== undefined && info.primaryName === 'output')
					return;
				simulateAssignment(child, result, executionState, isInProcedure);
			}
		}
	}
};