import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueWithEqualities } from
'./getTokenValueWithEqualities.js';
import { isNumber } from
'../../../../../isNumber.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateRepeat(repeatToken, result, executionState, procedureGlobalEffects) {
	const countToken = repeatToken.children[0];
	const instructionList = repeatToken.children[1];
	if (countToken !== undefined) {
		forgetVariablesChangedInToken(countToken, executionState);
		processAllVariableReadsAsEqualities(countToken, result, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	const countVal = getTokenValueWithEqualities(countToken, result);
	if (isNumber(countVal)) {
		if (countVal < 1)
			return true; // no iterations of the loop will execute so give up immediately.
		if (countVal < 2) {
			processInstructionList(instructionList, result, executionState, procedureGlobalEffects);
			return true;
		}
	}
	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	executionState.joinWith(executionStateClone, isNumber(countVal) && countVal >= 1);
	return true;
};