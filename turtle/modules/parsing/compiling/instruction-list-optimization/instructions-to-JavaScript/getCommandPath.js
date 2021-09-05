import { Command } from '../../../Command.js';
import { directReplacements } from '../../../../command-groups/MathCommands.js';
await Command.asyncInit();

const substitutions = new Map([
	['getProperty2', 'getProperty'],
	['setProperty2', 'setProperty']
]);

function getSubstitutedName(name) {
	const result = substitutions.get(name);
	if (result === undefined)
		return name;
	else
		return result;
}

export function getCommandPath(commandInfo) {
	const primaryName = getSubstitutedName(Command.getMethodNameFor(commandInfo));
	const commandGroup = commandInfo.commandGroup;
	if (commandGroup === 'compiled')
		return `context.${primaryName}`;
	else if (directReplacements.has(primaryName))
		return directReplacements.get(primaryName);
	else
		return `context.${commandGroup}.${primaryName}`;
};