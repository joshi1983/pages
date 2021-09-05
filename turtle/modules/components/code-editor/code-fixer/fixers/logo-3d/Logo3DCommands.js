import { Command } from
'../../../../../parsing/Command.js';
import { fetchJson } from
'../../../../../fetchJson.js';

const migrationData = await fetchJson('json/logo-migrations/Logo_3D.json');
const commandsMap = new Map();
for (const info of migrationData.commands) {
	commandsMap.set(info.primaryName.toLowerCase(), info);
	if (info.names !== undefined)
		for (const name of info.names) {
			commandsMap.set(name.toLowerCase(), info);
		}
	if (info.to !== undefined && info.returnTypes !== undefined) {
		const webLogoInfo = Command.getCommandInfo(info.to);
		info.returnTypes = webLogoInfo.returnTypes;
	}
}

export class Logo3DCommands {
	static getCommandInfo(name) {
		return commandsMap.get(name.toLowerCase());
	}
};