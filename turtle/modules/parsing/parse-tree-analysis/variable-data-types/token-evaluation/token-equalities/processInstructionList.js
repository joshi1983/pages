import { Command } from
'../../../../Command.js';
import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getProcedureStartToken } from
'../../../getProcedureStartToken.js';
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

export function processInstructionList(token, result, executionState) {
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
					executionState.forgetAllGlobalVariables();
				}
				if (simulateToken(child, result, executionState))
					continue;

				const info = Command.getCommandInfo(child.val);
				if (info === undefined ||
				info.primaryName === 'make' ||
				info.primaryName === 'localmake') 
					forgetVariablesChangedInTokenChildren(child, executionState);
				else
					forgetVariablesChangedInToken(child, executionState);

				processAllVariableReadsAsEqualities(child, result, executionState);
				simulateAssignment(child, result, executionState, isInProcedure);
			}
		}
	}
};