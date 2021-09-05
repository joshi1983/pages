import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueBasic } from
'../../getTokenValueBasic.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateWhile(whileToken, result, executionState) {
	const conditionToken = whileToken.children[0];
	const instructionList = whileToken.children[1];
	if (conditionToken !== undefined) {
		forgetVariablesChangedInToken(conditionToken, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	const conditionVal = getTokenValueBasic(conditionToken);
	if (conditionVal === false)
		return true; // skip processing the instruction list if the loop can't ever run.

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processAllVariableReadsAsEqualities(conditionToken, result, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone);
	executionState.joinWith(executionStateClone);
	return true;
};