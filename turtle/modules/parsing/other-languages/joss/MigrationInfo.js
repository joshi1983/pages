import { Command } from
'../../Command.js';
import { fetchJson } from
'../../../fetchJson.js';

await Command.asyncInit();
const data = await fetchJson('json/logo-migrations/JOSS.json');
const functionsMap = new Map();
for (const commandInfo of data.commands) {
	if (commandInfo.to !== undefined) {
		const webLogoCommand = Command.getCommandInfo(commandInfo.to);
		if (webLogoCommand !== undefined) {
			if (commandInfo.returnTypes === undefined)
				commandInfo.returnTypes = webLogoCommand.returnTypes;
			if (commandInfo.args === undefined)
				commandInfo.args = webLogoCommand.args;
		}
	}
	functionsMap.set(commandInfo.primaryName.toLowerCase(), commandInfo);
}

export class MigrationInfo {
	static getData() {
		return data;
	}

	static getFunctionInfo(name) {
		name = name.toLowerCase();
		return functionsMap.get(name);
	}
};