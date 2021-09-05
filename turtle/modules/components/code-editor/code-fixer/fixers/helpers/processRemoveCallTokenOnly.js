import { Command } from
'../../../../../parsing/Command.js';
import { getNextArgToken } from './getNextArgToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

export function processRemoveCallTokenOnly(cachedParseTree, fixLogger, migrationInfo) {
	const commandsOfInterest = migrationInfo.commands.filter(info => info.removeCallTokenOnly);
	if (commandsOfInterest.length === 0)
		return; // processRemoveCallTokenOnly has nothing to change.
	const lowerCaseNameSet = new Set();
	commandsOfInterest.forEach(function(info) {
		SetUtils.addAll(lowerCaseNameSet, Command.getLowerCaseCommandNameSet(info));
	});
	const tokensOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => lowerCaseNameSet.has(token.val.toLowerCase()));
	tokensOfInterest.forEach(function(tokenToRemove) {
		const argToken = getNextArgToken(tokenToRemove);
		if (argToken !== null) {
			const parent = tokenToRemove.parentNode;
			parent.replaceChild(tokenToRemove, argToken);
		}
		tokenToRemove.remove();
		fixLogger.log(`Removed call to ${tokenToRemove.val}`, tokenToRemove);
	});
	cachedParseTree.tokensRemoved(tokensOfInterest);
};