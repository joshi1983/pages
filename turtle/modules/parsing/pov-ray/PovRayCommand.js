import { Command } from '../../parsing/Command.js';
import { fetchJson } from '../../fetchJson.js';
await Command.asyncInit();
const migrationData = await fetchJson('json/logo-migrations/POVRay.json');
const commandsData = new Map();
migrationData.commands.forEach(function(commandInfo) {
	commandsData.set(commandInfo.primaryName, commandInfo);
});
export class PovRayCommand {
	static getCommandInfo(name) {
		return commandsData.get(name);
	}

	static getReturnTypes(info) {
		if (info === undefined)
			return null;
		if (info.returnTypes !== undefined)
			return info.returnTypes;
		if (info.to !== undefined) {
			const wlInfo = Command.getCommandInfo(info.to);
			if (wlInfo !== undefined)
				return wlInfo.returnTypes;
		}
	}
};