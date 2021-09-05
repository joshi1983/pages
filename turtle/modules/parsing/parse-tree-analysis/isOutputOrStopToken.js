import { Command } from '../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isOutputOrStopToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const command = Command.getCommandInfo(token.val);
	return command !== undefined && (command.primaryName === 'output' || command.primaryName === 'stop');
};