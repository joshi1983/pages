import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';

export function validateMigrateToCode(commandInfo, logger) {
	const migrateToCode = commandInfo.migrateToCode;
	if (migrateToCode !== undefined) {
		if (typeof migrateToCode !== 'string')
			logger(`migrateToCode must be a string but found ${migrateToCode}`);
		else {
			const parseLogger = new ParseLogger();
			const tree = LogoParser.getParseTree(migrateToCode, parseLogger);
			if (parseLogger.hasLoggedErrors() || tree === undefined)
				logger(`Failed to parse migrateToCode value of ${migrateToCode}.`);
			else if (tree.children.length !== 1)
				logger(`migrateToCode's value must parse with 1 top child but found ${tree.children.length}.`);
		}
		if (!(commandInfo.args instanceof Array) &&
		commandInfo.argCount === undefined)
			logger(`When migrateToCode is specified, we need args or argCount specified to know how many arguments to remove in the migration for the command.  Neither was specified, though.`);
	}
};