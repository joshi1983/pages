import { forgetVariablesChangedInToken } from
'./forgetVariablesChangedInToken.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { processAllVariableReadsAsEqualities } from
'./processAllVariableReadsAsEqualities.js';
import { processInstructionList } from
'./processInstructionList.js';

export function simulateFor(forToken, result, executionState, procedureGlobalEffects) {
	if (forToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		throw new Error(`forToken must be a PARAMETERIZED_GROUP but forToken.type = ${ParseTreeTokenType.getNameFor(forToken.type)}`);

	const settingsToken = forToken.children[0];
	const instructionList = forToken.children[1];
	if (settingsToken !== undefined) {
		forgetVariablesChangedInToken(settingsToken, executionState);
		processAllVariableReadsAsEqualities(settingsToken, result, executionState);
	}
	if (instructionList === undefined)
		return true; // weird case but just do nothing.

	// clear all variables that might be mutated or assigned in the instructionList.
	const executionStateClone = executionState.clone();
	forgetVariablesChangedInToken(instructionList, executionStateClone);
	processInstructionList(instructionList, result, executionStateClone, procedureGlobalEffects);
	executionState.joinWith(executionStateClone);
	return true;
};