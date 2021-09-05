import { Command } from
'../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.readCommand === undefined ||
	token.children.length !== 1)
		return false;

	const child = token.children[0];
	if (child.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const childInfo = Command.getCommandInfo(child.val);
	if (childInfo === undefined || childInfo.primaryName !== info.readCommand)
		return false;
	
	return true;
}

export function removeDoNothingCommandCalls(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	calls.forEach(function(call) {
		const tokens = getAllDescendentsAsArray(call);
		tokens.push(call);
		call.remove();
		cachedParseTree.tokensRemoved(tokens);
		fixLogger.log(`Removed a call to command ${call.val} because it had no effect.`, call);
	});
};