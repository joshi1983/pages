import { Command } from '../../modules/parsing/Command.js';

export function validateReadCommand(commandInfo, logger) {
	const readCommand = commandInfo.readCommand;
	if (readCommand !== undefined) {
		if (typeof readCommand !== 'string')
			logger('readCommand must either not be set or must be a string');
		else if (Command.getCommandInfo(readCommand) === undefined)
			logger(`readCommand must match another Command but ${readCommand} does not`);
		else {
			const readPrimaryName = Command.getCommandInfo(readCommand).primaryName;
			if (readPrimaryName !== readCommand)
				logger(`readCommand must be a case-sensitive match for another command.  ${readCommand} !== ${readPrimaryName}`);
		}
		if (commandInfo.args.length !== 1)
			logger('readCommand expected only for commands that take 1 argument.  ' +
				'Without taking 1 input, the return value of the readCommand can not ' +
				`provide the exact number of inputs to the corresponding non-readCommand.  This one takes ${commandInfo.args.length}`);
		else {
			const readCommandInfo = Command.getCommandInfo(commandInfo.readCommand);
			if (readCommandInfo.args.length !== 0)
				logger(`A corresponding readCommand is expected to take 0 arguments but got ${readCommandInfo.args.length}`);
		}
	}
};