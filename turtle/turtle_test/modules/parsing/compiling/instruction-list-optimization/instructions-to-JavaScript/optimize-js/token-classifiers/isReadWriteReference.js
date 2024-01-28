import { Command } from '../../../../../Command.js';
import { tokenToCommandInfo } from './tokenToCommandInfo.js';

await Command.asyncInit();
const primaryNameSet = new Set(Command.getCommandsWithVariableRefTypes().map(info => info.primaryName));

export function isReadWriteReference(token) {
	const info = tokenToCommandInfo(token);
	if (info === undefined)
		return false;
	return primaryNameSet.has(info.primaryName);
};