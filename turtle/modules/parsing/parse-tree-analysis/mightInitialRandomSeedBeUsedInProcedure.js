import { Command } from '../Command.js';
import { getSortedFirstTokenFromArray } from
'../generic-parsing-utilities/getSortedFirstTokenFromArray.js';
import { getTokensByType } from
'../generic-parsing-utilities/getTokensByType.js';
import { isAfterOrSame } from
'../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { rerandomNames, randomCommandNames } from './mightInitialRandomSeedBeUsed.js';

/*
This can be useful for testing procedures like
animation.setup and animation.snapshotstyle.
*/
export function mightInitialRandomSeedBeUsedInProcedure(cachedParseTree, procName) {
	if (typeof cachedParseTree !== 'object')
		throw new Error(`cachedParseTree must be an object but found ${cachedParseTree}`);

	procName = procName.toLowerCase();
	// are any random functions used?
	const pCalls = getTokensByType(cachedParseTree,
		ParseTreeTokenType.PARAMETERIZED_GROUP);
	const calls = pCalls.filter(t => randomCommandNames.has(t.val.toLowerCase()));
	let randomReads = calls.filter(t => !rerandomNames.has(t.val.toLowerCase));
	if (randomReads.length === 0)
		return false;
	let rerandomCalls = randomReads.filter(t => rerandomNames.has(t.val.toLowerCase()));
	const callsMap = cachedParseTree.getProcedureCallGraph();
	const uncalledProcNameSet = callsMap.fromProcCalls.get(procName);
	if (uncalledProcNameSet !== undefined && uncalledProcNameSet.size !== 0) {
		if (randomReads.some(function(randomRead) {
			const proc = cachedParseTree.getProcedureAtToken(randomRead);
			if (proc !== undefined && uncalledProcNameSet.has(proc.name))
				return false;
			return true;
		}))
			return true;
	}
	if (rerandomCalls.length !== 0) {
		// filter to global only.
		rerandomCalls = rerandomCalls.filter(function(rerandomCall) {
			const proc = cachedParseTree.getProcedureAtToken(rerandomCall);
			if (proc === undefined)
				return rerandomCall.parentNode.type === ParseTreeTokenType.TREE_ROOT;
			else
				return false;
		});
		if (rerandomCalls.length !== 0) {
			const procCalls = pCalls.filter(t => Command.getCommandInfo(t.val) === undefined);
			const globalRandomReads = randomReads.filter(function(r) {
				const proc = cachedParseTree.getProcedureAtToken(r);
				if (proc === undefined)
					return true;
				else
					return false;
			});
			if (globalRandomReads.length !== 0) {
				const firstRerandom = getSortedFirstTokenFromArray(rerandomCalls);
				const firstRead = getSortedFirstTokenFromArray(globalRandomReads);
				if (isAfterOrSame(firstRerandom, firstRead)) {
					if (procCalls.length !== 0) {
						const firstProcCall = getSortedFirstTokenFromArray(procCalls);
						if (isAfterOrSame(firstRerandom, firstProcCall))
							return true;
					}
					return false;
				}
			}
		}
	}
	return true;
}