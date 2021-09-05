import { fetchJson } from '../fetchJson.js';
const unsupportedCommands = await fetchJson('json/unsupportedCommands.json');
const unsupportedCommandMap = new Map();

// make sure the names are all lower case and populate set of command names.
unsupportedCommands.forEach(function(commandInfo) {
	commandInfo.name = commandInfo.name.toLowerCase();
	unsupportedCommandMap.set(commandInfo.name, commandInfo);
});

export class UnsupportedCommand {
	static getUnsupportedCommandInfo(name) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');

		name = name.toLowerCase();
		return unsupportedCommandMap.get(name);
	}

};