import { Command } from '../../../Command.js';
import { directReplacements as directReplacementsMath } from
'../../../../command-groups/MathCommands.js';
import { directReplacements as directReplacementsString } from
'../../../../command-groups/StringCommands.js';
import { getMethodNameForCommand } from '../../../getMethodNameForCommand.js';
import { MapUtils } from '../../../../MapUtils.js';
await Command.asyncInit();

const directReplacements = new Map();
MapUtils.merge(directReplacements, directReplacementsMath);
MapUtils.merge(directReplacements, directReplacementsString);

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
	const primaryName = getSubstitutedName(getMethodNameForCommand(commandInfo.primaryName));
	const commandGroup = commandInfo.commandGroup;
	if (commandGroup === 'compiled')
		return `context.${primaryName}`;
	else if (directReplacements.has(primaryName))
		return directReplacements.get(primaryName);
	else
		return `context.${commandGroup}.${primaryName}`;
};