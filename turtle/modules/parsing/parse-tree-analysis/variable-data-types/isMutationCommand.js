import { Command } from '../../Command.js';
await Command.asyncInit();

export const mutatingCommandsArray = [
	'localmake', 'make', 'queue', 'queue2',
	'setItem', 'setProperty'];
const mutatingCommands = new Set(mutatingCommandsArray);

export function loadCommandToVarIndexes(commandToVarIndexMap) {
	mutatingCommandsArray.
	filter(commandName => !commandToVarIndexMap.has(commandName)).
	forEach(function(commandName) {
		const info = Command.getCommandInfo(commandName);
		const index = info.args.findIndex(arg => arg.refTypes !== undefined);
		if (index === -1)
			console.error(`Failed to get variable reference parameter index for command: ${commandName}`);
		else
			commandToVarIndexMap.set(commandName, index);
	});
};


export function isMutationCommand(commandInfo) {
	if (typeof commandInfo === 'string') {
		commandInfo = Command.getCommandInfo(commandInfo);
		if (commandInfo === undefined)
			return false;
	}
	return mutatingCommands.has(commandInfo.primaryName);
};