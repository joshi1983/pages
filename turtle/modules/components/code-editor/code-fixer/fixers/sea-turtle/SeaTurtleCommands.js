import { fetchJson } from
'../../../../../fetchJson.js';

const migrationData = await fetchJson('json/logo-migrations/sea-turtle/SeaTurtle.json');
const commandsMap = new Map();
for (const info of migrationData.commands) {
	commandsMap.set(info.primaryName.toLowerCase(), info);
	if (info.names !== undefined)
		for (const name of info.names) {
			commandsMap.set(name.toLowerCase(), info);
		}
}

export class SeaTurtleCommands {
	static getAllNames() {
		return Array.from(commandsMap.keys());
	}

	static getCommandInfo(name) {
		return commandsMap.get(name.toLowerCase());
	}
};