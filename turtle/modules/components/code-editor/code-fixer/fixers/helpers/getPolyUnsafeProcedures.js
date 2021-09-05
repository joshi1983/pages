import { Command } from '../../../../../parsing/Command.js';
import { getDescendentsOfType } from '../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../../SetUtils.js';
await Command.asyncInit();

const unsafeCommands = new Set();
Command.getAllCommandsInfo().forEach(function(commandInfo) {
	let add = false;
	if (commandInfo.searchKeywords !== undefined &&
	commandInfo.searchKeywords.indexOf('path') !== -1) {
		add = true;
	}
	if (add) {
		SetUtils.addAll(unsafeCommands, Command.getLowerCaseCommandNameSet(commandInfo));
	}
});

function containsUnsafeCommandCall(proc) {
	const pGroups = getDescendentsOfType(proc.getInstructionListToken(), ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(t => unsafeCommands.has(t.val.toLowerCase()));
	return pGroups.length !== 0;
}

function getProcedureCallsMap(procSet) {
	if (!(procSet instanceof Set))
		throw new Error(`procSet expected to be a Set but got ${procSet}`);
	const result = new Map();
	for (const proc of procSet) {
		const pGroups = getDescendentsOfType(proc.getInstructionListToken(), ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(t => Command.getCommandInfo(t.val) === undefined);
		const calls = new Set(pGroups.map(t => t.val.toLowerCase()));
		result.set(proc.name, calls);
	}
	return result;
}

/*
The cachedParseTree is expected to be as defined in
parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js

Returns a Set containing the lower case names of every unsafe procedure in the tree.
*/
export function getPolyUnsafeProcedures(cachedParseTree) {
	const procs = cachedParseTree.getProceduresMap();
	if (procs.size === 0)
		return new Set();
	const unsafeSet = new Set();
	for (const [name, proc] of procs) {
		if (containsUnsafeCommandCall(proc))
			unsafeSet.add(name);
	}
	if (unsafeSet.size === 0)
		return unsafeSet;

	// Perform a closure on all direct and indirect calls 
	// to the unsafe procedures from other procedures.
	let continueLooping = true;
	const remainingProcs = new Set(Array.from(procs.values()).filter(p => !unsafeSet.has(p.name)));
	const procedureCallsMap = getProcedureCallsMap(remainingProcs);
	while (continueLooping) {
		continueLooping = false;
		for (const proc of remainingProcs) {
			if (SetUtils.isIntersecting(procedureCallsMap.get(proc.name), unsafeSet)) {
				unsafeSet.add(proc.name);
				continueLooping = true;
			}
		}
		if (continueLooping === true) {
			SetUtils.remove(remainingProcs, function(p) {
				return !unsafeSet.has(p.name);
			});
		}
	}
	
	return unsafeSet;
};