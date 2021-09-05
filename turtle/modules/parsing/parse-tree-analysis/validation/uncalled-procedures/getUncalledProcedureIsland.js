import { getTokensByType } from
'../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getUncalledProcedureIsland(cachedParseTree, excludeNameSet) {
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
};