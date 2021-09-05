import { Command } from '../Command.js';

function isOfInterest(proc) {
	const name = proc.name;
	const info = Command.getCommandInfo(name);
	return info === undefined;
}

export function renameInternalProcedures(program) {
	const procedures = program.procedures;
	const procsOfInterest = Array.from(procedures.values()).filter(isOfInterest);
	const nameSet = new Set(procsOfInterest.map(p => p.name));
	for (const proc of procsOfInterest) {
		const fromName = proc.name;
		proc.name = '$' + fromName;
		procedures.delete(fromName);
		procedures.set(proc.name, proc);
	}
};