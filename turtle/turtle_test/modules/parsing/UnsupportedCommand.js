import { fetchJson } from '../fetchJson.js';
const unsupportedCommands = await fetchJson('json/unsupportedCommands.json');
const windowsCommands = await fetchJson('json/windowsCommands.json');
const unsupportedCommandMap = new Map();

// make sure the names are all lower case and populate set of command names.
unsupportedCommands.forEach(function(commandInfo) {
	commandInfo.name = commandInfo.name.toLowerCase();
	unsupportedCommandMap.set(commandInfo.name, commandInfo);
});

windowsCommands.forEach(function(name) {
	const info = {
		'name': name,
		'reason': `${name} is not supported by WebLogo because it is for managing a graphical user interface.  WebLogo's programs are focused on drawing graphics instead of collecting information and events from end users.`
	};
	unsupportedCommandMap.set(name, info);
});

export class UnsupportedCommand {
	static getUnsupportedCommandInfo(name) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');

		name = name.toLowerCase();
		return unsupportedCommandMap.get(name);
	}

};