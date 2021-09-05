import { getGeneralProcedureStartState } from
'./token-equalities/getGeneralProcedureStartState.js';
import { processInstructionList } from
'./token-equalities/processInstructionList.js';
import { SimulatedExecutionState } from
'./token-equalities/SimulatedExecutionState.js';

export function getTokenEqualitiesFromCachedParseTree(cachedParseTree) {
	const result = new Map();
	const state = new SimulatedExecutionState();
	processInstructionList(cachedParseTree.root, result, state);
	const proceduresMap = cachedParseTree.getProceduresMap();
	if (proceduresMap.size !== 0) {
		const generalProcedureStartState = getGeneralProcedureStartState(cachedParseTree);
		for (const procedure of proceduresMap.values()) {
			const procStartState = generalProcedureStartState.clone();
			// FIXME: make the procStartState as complete as possible considering if/when the procedure gets called.
			const instructionList = procedure.getInstructionListToken();
			if (instructionList !== undefined) {
				processInstructionList(instructionList, result, procStartState);
			}
		}
	}
	return result;
};