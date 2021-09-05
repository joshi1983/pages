import { fetchJson } from '../../fetchJson.js';
const moduleData = await fetchJson('json/logo-migrations/FMSLogo.json');
const commandsMap = new Map();
moduleData.commands.forEach(function(info) {
	commandsMap.set(info.primaryName.toLowerCase(), info);
	if (info.names !== undefined)
		for (const name of info.names) {
			commandsMap.set(name.toLowerCase(), info);
		}
});

export class FMSCommand {
	static getCommandInfo(name) {
		name = name.toLowerCase();
		return commandsMap.get(name);
	}
};