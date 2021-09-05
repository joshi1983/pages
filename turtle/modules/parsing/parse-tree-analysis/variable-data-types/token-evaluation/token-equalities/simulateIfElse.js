import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { getTokenValueWithEqualities } from
'./getTokenValueWithEqualities.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateIfElse(ifElseToken, result, executionState, procedureGlobalEffects) {
	const conditionToken = ifElseToken.children[0];
	const instructionList1 = ifElseToken.children[1];
	const instructionList2 = ifElseToken.children[2];
	if (conditionToken !== undefined) {
		forgetVariablesChangedInToken(conditionToken, executionState);
		processAllVariableReadsAsEqualities(conditionToken, result, executionState);
	}
	if (instructionList1 === undefined)
		return true; // weird case but just do nothing.
	
	const conditionVal = getTokenValueWithEqualities(conditionToken, result);
	if (conditionVal === false) {
		processInstructionList(instructionList2, result, executionState, procedureGlobalEffects);
		return true;
	} else if (conditionVal === true) {
		processInstructionList(instructionList1, result, executionState, procedureGlobalEffects);
		return true;
	}
	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone1 = executionState.clone();
	const executionStateClone2 = executionState.clone();
	forgetVariablesChangedInToken(instructionList1, executionStateClone1);
	processInstructionList(instructionList1, result, executionStateClone1, procedureGlobalEffects);
	executionState.joinWith(executionStateClone1, conditionVal === true);

	forgetVariablesChangedInToken(instructionList2, executionStateClone2);
	processInstructionList(instructionList2, result, executionStateClone2, procedureGlobalEffects);
	executionState.joinWith(executionStateClone2, conditionVal === false);
	return true;
};