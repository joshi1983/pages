import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const specialProcedures = ['animation.setup', 'animation.snapshotstyle'];

function getUncalledProcedureIsland(cachedParseTree, excludeNameSet) {
	const procCallGraph = cachedParseTree.getProcedureCallGraph();
	const procsMap = cachedParseTree.getProceduresMap();
	const definitelyCalledNames = new Set();
	// find procedures directly called from global scope.
	const procCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(tok => procsMap.has(tok.val.toLowerCase()));
	for (const call of procCalls) {
		const containingProcedure = cachedParseTree.getProcedureAtToken(call);
		if (containingProcedure === undefined ||
		definitelyCalledNames.has(containingProcedure.name))
			definitelyCalledNames.add(call.val.toLowerCase());
	}
	let recentlyCalled = definitelyCalledNames;
	while (recentlyCalled.size !== 0) {
		const newRecentlyCalled = new Set();
		for (const procName of recentlyCalled) {
			if (!newRecentlyCalled.has(procName)) {
				const fromProcCalls = procCallGraph.fromProcCalls.get(procName);
				if (fromProcCalls !== undefined) {
					for (const calledProcName of fromProcCalls.values()) {
						if (!definitelyCalledNames.has(calledProcName)) {
							newRecentlyCalled.add(calledProcName);
							definitelyCalledNames.add(calledProcName);
						}
					}
				}
			}
		}
		recentlyCalled = newRecentlyCalled;
	}
	const result = new Set();
	for (const proc of procsMap.values()) {
		if (!definitelyCalledNames.has(proc.name) &&
		!excludeNameSet.has(proc.name))
			result.add(proc.name);
	}
	return result;
}

/*
This is not normally used in analyzeCodeQuality.
This could be useful in a quality report, though.
*/
export function validateUnusedProcedures(cachedParseTree, parseLogger) {
	const procsMap = cachedParseTree.getProceduresMap();
	const warnedNames = new Set(specialProcedures);
	for (const proc of procsMap.values()) {
		if (warnedNames.has(proc.name))
			continue;
		const calls = cachedParseTree.getProcedureCallsByName(proc.name);
		let msg;
		if (calls.length === 0) {
			msg = `Procedure ${proc.name} is never called.`;
		}
		else {
			const outsideCalls = calls.filter(function(call) {
				const containingProcedure = cachedParseTree.getProcedureAtToken(call);
				if (containingProcedure === undefined)
					return true;
				if (containingProcedure.name === proc.name)
					return false;
				return true;
			});
			if (outsideCalls.length === 0)
				msg = `Procedure ${proc.name} is never called outside of itself.`;
		}
		if (msg !== undefined) {
			warnedNames.add(proc.name);
			parseLogger.warn(msg, proc.getStartToken());
		}
	}
	const uncalled = getUncalledProcedureIsland(cachedParseTree, warnedNames);
	for (const uncalledProcName of uncalled) {
		const proc = procsMap.get(uncalledProcName);
		parseLogger.warn(`The procedure ${proc} is never called from by any code outside of a procedure directly or indirectly.`,
			proc.getStartToken());
	}
};