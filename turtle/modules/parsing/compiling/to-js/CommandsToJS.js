import { Command } from '../../Command.js';
import { fetchJson } from '../../../fetchJson.js';

const data = await fetchJson('json/JavaScript/webLogoToJavaScript.json');
await Command.asyncInit();
const commandsMap = new Map();
for (const commandInfo of data.commands) {
	const info = Command.getCommandInfo(commandInfo.primaryName);
	const names = Command.getLowerCaseCommandNameSet(info);
	for (const name of names) {
		commandsMap.set(name, commandInfo);
	}
	if (commandInfo.returnTypes === undefined)
		commandInfo.returnTypes = info.returnTypes;
}

export class CommandsToJS {
	static getCommandInfo(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but found ${name}`);

		name = name.toLowerCase();
		return commandsMap.get(name);
	}
};