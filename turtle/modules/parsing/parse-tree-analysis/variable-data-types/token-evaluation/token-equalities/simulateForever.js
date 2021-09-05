import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateForever(foreverToken, result, executionState, procedureGlobalEffects) {
	const instructionList = foreverToken.children[0];
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	executionState.joinWith(executionStateClone, true);
	return true;
};