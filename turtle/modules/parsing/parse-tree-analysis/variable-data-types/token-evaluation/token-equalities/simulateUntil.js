import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueWithEqualities } from
'./getTokenValueWithEqualities.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateUntil(untilToken, result, executionState, procedureGlobalEffects) {
	const conditionToken = untilToken.children[0];
	const instructionList = untilToken.children[1];
	if (conditionToken !== undefined) {
		forgetVariablesChangedInToken(conditionToken, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	const conditionVal = getTokenValueWithEqualities(conditionToken, result);
	if (conditionVal === true)
		return true; // skip processing the instruction list if the instruction list can't ever run.

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processAllVariableReadsAsEqualities(conditionToken, result, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	executionState.joinWith(executionStateClone, conditionVal === false);
	return true;
};