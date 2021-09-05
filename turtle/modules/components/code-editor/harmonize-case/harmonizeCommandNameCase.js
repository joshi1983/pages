import { Command } from '../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function getBestName(commandInfo) {
	const questionMarkName = commandInfo.primaryName.substring(0, commandInfo.primaryName.length - 1) + '?';
	if (commandInfo.primaryName.endsWith('p') &&
	commandInfo.names.some(name => name === questionMarkName))
		return questionMarkName;
	else
		return commandInfo.primaryName;
}

export function harmonizeCommandNameCase(parseTree) {
	const commandCalls = parseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => Command.getCommandInfo(token.val) !== undefined);
	for (let i = 0; i < commandCalls.length; i++) {
		const commandCall = commandCalls[i];
		const oldValue = commandCall.val;
		const info = Command.getCommandInfo(oldValue);
		const bestName = getBestName(info);
		if (bestName !== oldValue) {
			commandCall.val = bestName;
			parseTree.tokenValueChanged(commandCall, oldValue);
		}
	}
};