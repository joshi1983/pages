import { Command } from '../../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isCommandInfoOfInterest(commandInfo) {
	if (commandInfo.to === undefined)
		return false;
	const toInfo = Command.getCommandInfo(commandInfo.to);
	const lowerNames = Command.getLowerCaseCommandNameSet(commandInfo);
	for (const name of lowerNames) {
		const info = Command.getCommandInfo(name);
		if (info !== undefined && toInfo.primaryName !== info.primaryName)
			return true;
	}
	return false;
}

function isOfInterest(fromNames) {
	return function(token) {
		if (!fromNames.has(token.val.toLowerCase()))
			return false;
		return true;
	};
}

export function processWebLogoCommandRename(cachedParseTree, fixLogger, info) {
	const fromCommands = info.commands.filter(isCommandInfoOfInterest);
	if (fromCommands.length === 0)
		return; // for most migrations, we'll simply return here because it is rare for 
		// a migration to need to rename WebLogo commands.

	const fromCommandNamesMap = new Map();
	fromCommands.forEach(function(migratedCommandInfo) {
		const toInfo = Command.getCommandInfo(migratedCommandInfo.to);
		const lowerNames = Command.getLowerCaseCommandNameSet(migratedCommandInfo);
		for (const name of lowerNames) {
			const info = Command.getCommandInfo(name);
			if (info !== undefined && toInfo.primaryName !== info.primaryName)
				fromCommandNamesMap.set(name, migratedCommandInfo);
		}
	});
	const callsOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest(fromCommandNamesMap));
	callsOfInterest.forEach(function(callToken) {
		const oldVal = callToken.val;
		const migratedCommandInfo = fromCommandNamesMap.get(callToken.val.toLowerCase());
		callToken.val = migratedCommandInfo.to;
		// FIXME: check if the number of children needs adjusting.
		// The new command may require a different number of parameters than the old one.

		fixLogger.log(`Renamed ${oldVal} to ${callToken.val} because that is the equivalent command in WebLogo for ${oldVal} from ${info.name}`, callToken);
	});
};