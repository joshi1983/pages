import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
await Command.asyncInit();
const commands = await fetchJson('json/unsupportedCommands.json');

function testConsistentFormatting(logger) {
	commands.forEach(function(commandInfo, index) {
		const plogger = prefixWrapper(`command ${index} with name ${commandInfo.name}`, logger);
		if (typeof commandInfo.name !== 'string')
			plogger(`name required to be a string. Not: ${commandInfo.name}`);
		if (typeof commandInfo.reason !== 'string')
			plogger(`reason required to be a string. Not: ${commandInfo.reason}`);
		if (commandInfo.autoRemove !== undefined && typeof commandInfo.autoRemove !== 'boolean')
			plogger(`autoRemove must either be undefined or a boolean.  Not: ${commandInfo.autoRemove}`);
		if (commandInfo.args !== undefined && !(commandInfo.args instanceof Array))
			plogger(`args must either be undefined or an Array.  Not: ${commandInfo.args}`);
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