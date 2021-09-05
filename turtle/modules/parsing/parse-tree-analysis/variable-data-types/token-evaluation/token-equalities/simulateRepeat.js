import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueBasic } from
'../../getTokenValueBasic.js';
import { isNumber } from
'../../../../../isNumber.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateRepeat(repeatToken, result, executionState) {
	const countToken = repeatToken.children[0];
	const instructionList = repeatToken.children[1];
	if (countToken !== undefined) {
		forgetVariablesChangedInToken(countToken, executionState);
		processAllVariableReadsAsEqualities(countToken, result, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	const countVal = getTokenValueBasic(countToken);
	if (isNumber(countVal)) {
		if (countVal < 1)
			return true; // no iterations of the loop will execute so give up immediately.
		if (countVal < 2) {
			processInstructionList(instructionList, result, executionState);
			return true;
		}
	}
	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone);
	executionState.joinWith(executionStateClone);
	return true;
};