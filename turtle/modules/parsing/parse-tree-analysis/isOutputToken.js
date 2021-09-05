import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
await Command.asyncInit();

export function isOutputToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const command = Command.getCommandInfo(token.val);
	return command !== undefined && command.primaryName === 'output';
};