import { Command } from '../../../Command.js';
import { directReplacements } from '../../../../command-groups/MathCommands.js';
await Command.asyncInit();

export function getCommandPath(commandInfo) {
	const primaryName = Command.getMethodNameFor(commandInfo);
	const commandGroup = commandInfo.commandGroup;
	if (commandGroup === 'compiled')
		return `context.${primaryName}`;
	else if (directReplacements.has(primaryName))
		return directReplacements.get(primaryName);
	else
		return `context.${commandGroup}.${primaryName}`;
};