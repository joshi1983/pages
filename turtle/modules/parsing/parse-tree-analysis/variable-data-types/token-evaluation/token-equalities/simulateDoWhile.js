import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueBasic } from
'../../getTokenValueBasic.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateDoWhile(doWhileToken, result,
executionState, procedureGlobalEffects) {
	const instructionList = doWhileToken.children[0];
	if (instructionList === undefined)
		return true; // weird case but just do nothing.
	const conditionToken = doWhileToken.children[1];

	const conditionVal = getTokenValueBasic(conditionToken);

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	if (conditionVal !== false)
		forgetVariablesChangedInToken(instructionList, executionStateClone);

	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	processAllVariableReadsAsEqualities(conditionToken, result, executionStateClone);
	executionState.joinWith(executionStateClone, true);
	return true;
};