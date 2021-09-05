import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
await Command.asyncInit();
const commands = await fetchJson('json/unsupportedCommands.json');

function testConsistentFormatting(logger) {
	commands.forEach(function(commandInfo, index) {
		if (typeof commandInfo.name !== 'string')
			logger('name required for unsupported command at index ' + index);
		if (typeof commandInfo.reason !== 'string')
			logger('reason required for unsupported command at index ' + index);
	});
}

function testAllUnsupportedCommandsAreNotRecognized(logger) {
	commands.forEach(function(commandInfo, index) {
		let recognizedCommandInfo = Command.getCommandInfo(commandInfo.name);
		if (recognizedCommandInfo === undefined)
			recognizedCommandInfo = Command.getCommandInfoByHintName(commandInfo.name);
		if (recognizedCommandInfo !== undefined)
			logger('An unsupported command from unsupportedCommands.json matches a recognized command from commands.json.  ' + commandInfo.name + ' matches a command with primaryName ' + recognizedCommandInfo.primaryName + '.  One of the two should be removed or renamed.');
		
	});
}

export function testUnsupportedCommandsJSON(logger) {
	testConsistentFormatting(logger);
	testAllUnsupportedCommandsAreNotRecognized(logger);
};