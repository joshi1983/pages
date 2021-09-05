import { Command } from '../Command.js';
import { fetchJson } from '../../fetchJson.js';
await Command.asyncInit();
const migrationData = await fetchJson('json/logo-migrations/KTurtle.json');
const commandsData = new Map();
function convertMigrationCommandDataToInfo(migrationCommandData) {
	const result = {};
	function copyFromMigration() {
		Object.assign(result, migrationCommandData);
	}
	if (migrationCommandData.to !== undefined) {
		copyFromMigration();
		const info = Command.getCommandInfo(migrationCommandData.to);
		if (info !== undefined) {
			result.primaryName = info.primaryName;
			result.to = info.primaryName;
			result.args = info.args;
			result.argCount = info.argCount;
		}
	}
	else {
		copyFromMigration();
	}
	return result;
}

migrationData.commands.forEach(function(commandInfo) {
	const info = convertMigrationCommandDataToInfo(commandInfo);
	const name = commandInfo.primaryName.toLowerCase();
	commandsData.set(name, info);
	if (commandInfo.names instanceof Array) {
		commandInfo.names.forEach(function(name) {
			commandsData.set(name, info);
		});
	}
});

export class KTurtleCommand {
	static getCommandInfo(name) {
		return commandsData.get(name.toLowerCase());
	}
};