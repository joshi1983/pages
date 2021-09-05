import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueWithEqualities } from
'./getTokenValueWithEqualities.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateIf(ifToken, result, executionState, procedureGlobalEffects) {
	const conditionToken = ifToken.children[0];
	const instructionList = ifToken.children[1];
	if (conditionToken !== undefined) {
		forgetVariablesChangedInToken(conditionToken, executionState);
		processAllVariableReadsAsEqualities(conditionToken, result, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.
	
	const conditionVal = getTokenValueWithEqualities(conditionToken, result);
	if (conditionVal === false)
		return true; // skip processing the instruction list if the instruction list can't ever run.

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	executionState.joinWith(executionStateClone, conditionVal === true);
	return true;
};