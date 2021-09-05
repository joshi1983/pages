import { Command } from '../Command.js';

export function isInternalProcedure(procedure) {
	if (procedure.name[0] === '$')
		return true;
	const info = Command.getCommandInfo(procedure.name);
	return info !== undefined;
};