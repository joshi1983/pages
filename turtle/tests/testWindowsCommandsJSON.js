import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';
await Command.asyncInit();

const windowsCommands = await fetchJson('json/windowsCommands.json');

function testGeneral(logger) {
	windowsCommands.forEach(function(commandName, index) {
		if (typeof commandName !== 'string')
			logger(`Expected a commandName string but got ${commandName} at index ${index}`);
		else {
			const info = Command.getCommandInfo(commandName);
			if (info !== undefined)
				logger(`The windows command ${commandName} should not be supported but it was found by Command.getCommandInfo. The found command information has primaryName = ${info.primaryName}`);
		}
		if (index > 0 && windowsCommands[index] === windowsCommands[index - 1])
			logger(`Duplicate commands found with name ${windowsCommands[index]}`);
		else if (index > 0 && windowsCommands[index] < windowsCommands[index - 1])
			logger(`Commands out of alphabetical order.  ${windowsCommands[index - 1]} and ${windowsCommands[index]}`);
	});
}

async function testWindowsCommandsAreNotAlsoInUnsupportedCommandsJSON(logger) {
	const unsupportedCommands = await fetchJson('json/unsupportedCommands.json');
	unsupportedCommands.forEach(function(unsupportedCommandInfo) {
		const name = unsupportedCommandInfo.name.toLowerCase();
		if (windowsCommands.indexOf(name) !== -1)
			logger(`All unsupportedCommand.json names should be left out of windowsCommands.json but found ${name} in both.`);
	});
}

export function testWindowsCommandsJSON(logger) {
	return wrapAndCall([
		testGeneral,
		testWindowsCommandsAreNotAlsoInUnsupportedCommandsJSON
	], logger);
};