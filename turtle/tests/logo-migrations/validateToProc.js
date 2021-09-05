import { Command } from '../../modules/parsing/Command.js';
await Command.asyncInit();

export function validateToProc(commandInfo, logger) {
	if (commandInfo.toProc !== undefined) {
		if (typeof commandInfo.toProc !== 'string')
			logger(`Expected toProc to either be undefined or to be a string but found ${commandInfo.toProc}.`);
		else if (Command.getCommandInfo(commandInfo.toProc) !== undefined)
			logger(`Expected toProc to not match any command but one was found matching ${commandInfo.toProc}.  Did you mean to use "to" instead of "toProc"?`);
	}
};