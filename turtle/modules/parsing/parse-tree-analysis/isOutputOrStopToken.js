import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { Command } from '../Command.js';

export function isOutputOrStopToken(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const command = Command.getCommandInfo(token.val);
	return command !== undefined && (command.primaryName === 'output' || command.primaryName === 'stop');
};