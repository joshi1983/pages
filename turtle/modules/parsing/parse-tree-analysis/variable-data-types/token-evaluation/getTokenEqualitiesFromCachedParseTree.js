import { getGeneralProcedureStartState } from
'./token-equalities/getGeneralProcedureStartState.js';
import { getProcedureEffectsOnGlobalVariables } from
'./token-equalities/getProcedureEffectsOnGlobalVariables.js';
import { processCallsToProcedure } from
'./token-equalities/processCallsToProcedure.js';
import { processInstructionList } from
'./token-equalities/processInstructionList.js';
import { SimulatedExecutionState } from
'./token-equalities/SimulatedExecutionState.js';

export function getTokenEqualitiesFromCachedParseTree(cachedParseTree) {
	const result = new Map();
	const state = new SimulatedExecutionState();
	const procedureGlobalEffects = getProcedureEffectsOnGlobalVariables(cachedParseTree);
	processInstructionList(cachedParseTree.root, result, state,
		procedureGlobalEffects);
	const proceduresMap = cachedParseTree.getProceduresMap();
	if (proceduresMap.size !== 0) {
		const generalProcedureStartState = getGeneralProcedureStartState(
			cachedParseTree);
		for (const procedure of proceduresMap.values()) {
			processCallsToProcedure(cachedParseTree, procedure, result);
			const procStartState = generalProcedureStartState.clone();
			// FIXME: make the procStartState as complete as possible considering if/when the procedure gets called.
			const calls = cachedParseTree.getProcedureCallsByName(procedure.name);
			if (calls.length === 1) {
				// If the procedure is called exactly once, bind the token.
				const call = calls[0];
				for (let i = Math.min(call.children.length,
				procedure.parameters.length) - 1;
				i >= 0; i--) {
					const parameterName = procedure.parameters[i];
					const valueToken = call.children[i];
					procStartState.make(parameterName, valueToken, false);
				}
			}
			const instructionList = procedure.getInstructionListToken();
			if (instructionList !== undefined) {
				processInstructionList(instructionList, result, procStartState, procedureGlobalEffects);
			}
		}
	}
	return result;
};