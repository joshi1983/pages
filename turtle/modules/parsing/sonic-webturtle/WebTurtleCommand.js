import { Command } from '../Command.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { fetchJson } from '../../fetchJson.js';
const migrationInfo = await fetchJson('json/logo-migrations/SonicWebTurtle.json');
await Command.asyncInit();

const commandsMap = new Map();
migrationInfo.commands.forEach(function(commandInfo) {
	commandsMap.set(commandInfo.primaryName.toLowerCase(), commandInfo);
});
const stringTypes = new DataTypes('string');

export class WebTurtleCommand {
	static couldArgBeStringLiteral(commandInfo, argIndex) {
		if (commandInfo.primaryName === 'let' && argIndex === 0)
			return false;
		let args = commandInfo.args;
		if (args === undefined && commandInfo.to !== undefined) {
			const webLogoCommandInfo = Command.getCommandInfo(commandInfo.to);
			if (webLogoCommandInfo !== undefined)
				args = webLogoCommandInfo.args;
		}
		if (args === undefined || args[argIndex] === undefined)
			return true; // completely unknown.
		const argInfo = args[argIndex];

		// variable references are not string literals in Sonic WebTurtle.
		if (argInfo.refTypes !== undefined || argInfo.types === 'color') 
			return false;

		if (argInfo.types === 'string')
			return true;
		const dataTypes = new DataTypes(argInfo.types);
		return dataTypes.hasIntersectionWith(stringTypes);
	}

	static getCommandInfo(name) {
		return commandsMap.get(name.toLowerCase());
	}

	static getArgCount(info) {
		if (typeof info === 'string')
			info = WebTurtleCommand.getCommandInfo(info);
		if (info.args !== undefined)
			return info.args.length;
		if (info.to !== undefined) {
			const webLogoCommandInfo = Command.getCommandInfo(info.to);
			return Command.getArgCount(webLogoCommandInfo).defaultCount;
		}
	}
};