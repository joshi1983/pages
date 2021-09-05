import { getDescendentsOfType } from '../generic-parsing-utilities/getDescendentsOfType.js';
import { InternalProcedures } from './InternalProcedures.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { Procedure } from '../Procedure.js';
import { shouldTranslateToInternalProc } from './shouldTranslateToInternalProc.js';

export function addInternalProcs(tree, procedures) {
	const calls = getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(shouldTranslateToInternalProc);
	if (calls.length === 0)
		return;

	const library = InternalProcedures.getCompiledLibrary();
	const procedureDependenciesMap = InternalProcedures.getProcedureDependenciesMap();
	for (const call of calls) {
		const name = call.val.toLowerCase();
		if (!procedures.has(name)) {
			const proc = library.procedures.get(name);
			procedures.set(name, proc);
			const dependencies = procedureDependenciesMap.get(name);
			if (dependencies === undefined)
				console.error(`Unable to find dependencies for procedure with name ${name}`);
			else {
				for (const procName of dependencies) {
					const libProc2 = library.procedures.get(procName);
					if (!(libProc2 instanceof Procedure))
						console.error(`Failed to find a procedure in the internal procs with the name ${procName}`);
					else
						procedures.set(procName, libProc2);
				}
			}
		}
	}
};