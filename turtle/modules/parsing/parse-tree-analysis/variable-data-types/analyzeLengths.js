import { analyzeLengthsBasic } from './length-evaluation/analyzeLengthsBasic.js';
import { analyzeTokenLengthsForCommandCalls } from './length-evaluation/analyzeTokenLengthsForCommandCalls.js';
import { analyzeValuesForCountCallsUsingTokenLengthMap } from './token-evaluation/analyzeValuesForCountCallsUsingTokenLengthMap.js';
import { analyzeVariables } from './length-evaluation/analyzeVariables.js';

function isCalledFromOutsideProcedure(cachedParseTree, proc) {
	return function(callToken) {
		const fromProc = cachedParseTree.getProcedureAtToken(callToken);
		if (fromProc === undefined)
			return true;
		else
			return fromProc.name !== proc.name;
	};
};

function isCallOfInterest(cachedParseTree) {
	return function(callToken) {
		const proc = cachedParseTree.getProcedureAtToken(callToken);
		if (proc === undefined)
			return false;
		// make sure the procedure is called from somewhere outside of itself.
		// if proc is never run, we're not interested in callToken.
		const calls = cachedParseTree.getProcedureCallsByName(proc.name).
			filter(isCalledFromOutsideProcedure(cachedParseTree, proc));
		return calls.length !== 0;
	};
}

// Similar to mightQueue2MutateManyVariables except we're
// trying to calculate the result quickly and without a variables map.
function mightProcedureCallsChangeLength(cachedParseTree) {
	const callsOfInterest = cachedParseTree.getCommandCallsByNames(['queue2', 'dequeue2', 'removeLast']).filter(isCallOfInterest(cachedParseTree));
	if (callsOfInterest.length === 0)
		return false;
	return true;
}

export function analyzeLengths(cachedParseTree, tokenValuesMap) {
	const procedureCallsMayChangeLength = mightProcedureCallsChangeLength(cachedParseTree);
	const result = analyzeLengthsBasic(cachedParseTree, procedureCallsMayChangeLength);
	analyzeValuesForCountCallsUsingTokenLengthMap(cachedParseTree, result, tokenValuesMap);
	for (const [token, val] of tokenValuesMap.entries()) {
		if (!result.has(token) &&
		(val instanceof Array || typeof val === 'string')) {
			result.set(token, val.length);
		}
	}
	analyzeTokenLengthsForCommandCalls(cachedParseTree, tokenValuesMap, result);
	analyzeVariables(cachedParseTree, result, procedureCallsMayChangeLength, tokenValuesMap);
	return result;
};