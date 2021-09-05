import { getUncalledProcedureIsland } from
'./getUncalledProcedureIsland.js';
import { SetUtils } from
'../../../../SetUtils.js';
import { specialProcedures } from './specialProcedures.js';

export function getUncalledProcedures(cachedParseTree) {
	const procsMap = cachedParseTree.getProceduresMap();
	const warnedNames = new Set(specialProcedures);
	const result = new Set();
	for (const proc of procsMap.values()) {
		if (warnedNames.has(proc.name))
			continue;
		const calls = cachedParseTree.getProcedureCallsByName(proc.name);
		let isUncalled = false;
		if (calls.length === 0) {
			isUncalled = true;
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
				isUncalled = true;
		}
		if (isUncalled) {
			result.add(proc.name);
		}
	}
	SetUtils.addAll(warnedNames, result);
	const uncalled = getUncalledProcedureIsland(cachedParseTree, warnedNames);
	for (const uncalledProcName of uncalled) {
		result.add(uncalledProcName);
	}
	return result;
};