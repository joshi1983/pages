import { Command } from '../../../modules/parsing/Command.js';
import { randomPrimaryNames } from '../../../modules/parsing/parse-tree-analysis/randomPrimaryNames.js';
await Command.asyncInit();

export function testRandomPrimaryNames(logger) {
	for (const name of randomPrimaryNames) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Expected to find a command matching the name ${name} but not found`);
		else if (info.primaryName !== name)
			logger(`Expected an exact case-sensitive match for name(${name}) but found primaryName ${info.primaryName}`);
	}
	/*
	We randomPrimaryNames maintained to include all commands that return randomized results.
	The following code should help us detect some cases when we might add new commands to json/commands.json without this appropriate change to randomPrimaryNames.
	*/
	const randomLikePrimaryNames = Command.getAllCommandsInfo().map(info => info.primaryName).filter(function(primaryName) {
		const lower = primaryName.toLowerCase();
		if (lower.startsWith('rand'))
			return true;
	});
	randomLikePrimaryNames.forEach(function(primaryName) {
		if (!randomPrimaryNames.has(primaryName)) {
			logger(`Is ${primaryName} returning a randomized value?  If so, it should be included by randomPrimaryNames.  If it is ok, just tweak the test code that wrote this message to exclude that new command.`);
		}
	});
};