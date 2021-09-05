import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getTokenTypesBasic } from
'../../getTokenTypesBasic.js';
import { mightBeMutated } from
'./getUnmutatableGlobalVariables.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function mightBeMutatableVariable(variableName, executionState) {
	const token = executionState.getSingleValueToken(variableName);
	if (token === undefined)
		return true;
	if (mightBeMutated(getTokenTypesBasic(token)))
		return true;
	return false;
}

export function clearLocalVariablesModifiedInProcedureCall(
procCall, executionState, procedureGlobalEffects) {
	const procEffectsInfo = procedureGlobalEffects.procs.get(procCall.val.toLowerCase());
	if (procEffectsInfo !== undefined &&
	procEffectsInfo.hasMutation) {
		const variableReads = getDescendentsOfType(procCall,
			ParseTreeTokenType.VARIABLE_READ);
		for (const varRead of variableReads) {
			const variableName = varRead.val.toLowerCase();
			if (mightBeMutatableVariable(variableName, executionState)) {
				executionState.deleteAssociatedValueTokenFor(variableName);
			}
		}
	}
};