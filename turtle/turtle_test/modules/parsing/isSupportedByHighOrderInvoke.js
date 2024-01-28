import { Command } from './Command.js';
await Command.asyncInit();

const compiledCommands = Command.getAllCommandsInfo().filter(i => 
	i.commandGroup === 'compiled' || i.returnTypes === null).map(i => i.primaryName);
const restrictedArray = compiledCommands;
const restricted = new Set([...restrictedArray]);

export function getRestrictedCommandNames() {
	return restrictedArray;
};

export function isSupportedByHighOrderInvoke(commandInfo) {
	if (typeof commandInfo === 'string')
		commandInfo = Command.getCommandInfo(commandInfo);
	return !restricted.has(commandInfo.primaryName);
};