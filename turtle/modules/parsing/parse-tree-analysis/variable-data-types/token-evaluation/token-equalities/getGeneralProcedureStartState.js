import { Command } from
'../../../../Command.js';
import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isMutationCommand } from
'../../isMutationCommand.js';
import { mightContainProcedureCall } from
'./mightContainProcedureCall.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { commandToVarIndexMap } from
'../../setLastSingleValueTokens.js';
import { simulateAssignment } from
'./simulateAssignment.js';
import { SimulatedExecutionState } from
'./SimulatedExecutionState.js';
import { unwrapCurvedBracketExpressions } from
'./unwrapCurvedBracketExpressions.js';

export function getGeneralProcedureStartState(cachedParseTree) {
	const result = new SimulatedExecutionState();
	let procCallFound = false;
	const throwAwayMap = new Map();
	// simulate execution of global instructions up to the first call to a procedure.
	for (let child of cachedParseTree.root.children) {
		child = unwrapCurvedBracketExpressions(child);

		if (child.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			if (mightContainProcedureCall(child)) {
				procCallFound = true;
			}
			else if (!procCallFound) {
				processAllVariableReadsAsEqualities(child, throwAwayMap, result);
				if (child.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
					if (!simulateAssignment(child, throwAwayMap, result, false)) {
						forgetVariablesChangedInToken(child, result);
					}
				}
			}
			if (procCallFound)
				forgetVariablesChangedInToken(child, result);
		}
	}
	if (result.globalVariables.size !== 0) {
		// Forget any global variables that might be assigned or mutated in any procedure.
		for (const procedure of cachedParseTree.getProceduresMap().values()) {
			const instructionList = procedure.getInstructionListToken();
			if (instructionList !== undefined) {
				const mutationCalls = getDescendentsOfType(instructionList, ParseTreeTokenType.PARAMETERIZED_GROUP).
					filter(t => isMutationCommand(t.val));
				for (const call of mutationCalls) {
					const info = Command.getCommandInfo(call.val);
					const variableIndex = commandToVarIndexMap.get(info.primaryName);
					const variableToken = call.children[variableIndex];
					if (variableToken !== undefined && variableToken.isStringLiteral()) {
						const variableName = variableToken.val.toLowerCase();
						result.globalVariables.delete(variableName);
						if (result.globalVariables.size === 0)
							break;
					}
				}
			}
		}
	}
	return result;
};