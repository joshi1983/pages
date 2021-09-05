import { getUncalledProcedureIsland } from
'./uncalled-procedures/getUncalledProcedureIsland.js';
import { specialProcedures } from './uncalled-procedures/specialProcedures.js';

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