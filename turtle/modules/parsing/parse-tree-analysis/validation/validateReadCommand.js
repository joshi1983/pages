import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
const commandNames = Command.getCommandsWithReadCommand().map(commandInfo => commandInfo.primaryName);

export function validateReadCommand(cachedParseTree, parseLogger) {
	const callTokens = cachedParseTree.getCommandCallsByNames(commandNames).
		filter(callToken =>
			callToken.children.length === 1 &&
			callToken.children[0].type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
			callToken.children[0].children.length === 0);
	callTokens.forEach(function(callToken) {
		const parentInfo = Command.getCommandInfo(callToken.val);
		const childVal = callToken.children[0].val;
		const childInfo = Command.getCommandInfo(childVal);
		if (childInfo !== undefined && childInfo.primaryName === parentInfo.readCommand) {
			parseLogger.warn(`Feeding the output of ${childVal} to ${callToken.val} does nothing.  ${childInfo.primaryName} is the corresponding read command for ${parentInfo.primaryName}.`, callToken);
		}
	});
};