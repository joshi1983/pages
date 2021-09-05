import { Command } from '../Command.js';
import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { InternalProcedures } from './InternalProcedures.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isCallOfInterest(call) {
	const info = Command.getCommandInfo(call.val);
	return info !== undefined &&
		info.commandGroup === 'internalProc';
}

export function addInternalProcs(tree, procedures) {
	const calls = getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isCallOfInterest);
	if (calls.length === 0)
		return;

	const library = InternalProcedures.getCompiledLibrary();
	for (const call of calls) {
		const name = call.val.toLowerCase();
		if (!procedures.has(name)) {
			const proc = library.procedures.get(name);
			procedures.set(name, proc);
		}
	}
};