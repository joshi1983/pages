import { Command } from '../Command.js';
await Command.asyncInit();

export function getWebLogoSafeProcedureName(startValue, takenNames) {
	startValue = startValue.replaceAll('@', '');// remove all invalid characters.
	if (!takenNames.has(startValue) && Command.getCommandInfo(startValue) === undefined)
		return startValue;
	for (let i = 1; true; i++) {
		const newName = startValue + i;
		if (!takenNames.has(newName) && Command.getCommandInfo(newName) === undefined)
			return newName;
	}
};