import { checkOnly1Defined } from './checkOnly1Defined.js';
import { Command } from '../../modules/parsing/Command.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { Operators } from '../../modules/parsing/Operators.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';
import { validateSubArgs } from './validateSubArgs.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await Command.asyncInit();
await Operators.asyncInit();

function validateArgCount(argCount, logger) {
	if (argCount !== undefined) {
		if (typeof argCount === 'object') {
			['default', 'min', 'max'].forEach(function(key) {
				const val = argCount[key];
				if (val !== undefined) {
					if (!Number.isInteger(val))
						logger(`${key} must either be undefined or be an integer but found ${val}`);
				}
			});
		}
	}
}

function validateMigrateToCode(commandInfo, logger) {
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
}

export function validateCommands(fullInfoObject, logger) {
	if (!(fullInfoObject.commands instanceof Array))
		logger(`Expected a commands Array but got ${fullInfoObject.commands}`);
	else {
		const lowerCaseNames = new Set();
		fullInfoObject.commands.forEach(function(commandInfo, index) {
			const plogger = prefixWrapper(`Command ${index}, primaryName ${commandInfo.primaryName}`, logger);
			if (index > 0 && typeof commandInfo.primaryName === 'string' && typeof fullInfoObject.commands[index - 1].primaryName === 'string' &&
			commandInfo.primaryName.toLowerCase() <= fullInfoObject.commands[index - 1].primaryName.toLowerCase())
				plogger(`Expected to be sorted by primaryName but found a pair out of order.  ${commandInfo.primaryName} and ${fullInfoObject.commands[index - 1].primaryName}`);
			if (typeof commandInfo.primaryName !== 'string') {
				let extraInfo = '';
				if (index > 0)
					extraInfo = `Previous command's primaryName is ${fullInfoObject.commands[index - 1].primaryName}`;
				plogger(`Expected primaryName to be a string but got ${commandInfo.primaryName}.  ${extraInfo}`);
			}
			else if (fullInfoObject.caseSensitiveCommandNames !== true) {
				if (lowerCaseNames.has(commandInfo.primaryName.toLowerCase()))
					plogger(`Expected all primaryName and names elements to be unique in lower case but this primaryName was already found.`);
				else
					lowerCaseNames.add(commandInfo.primaryName.toLowerCase());
			}
			if (commandInfo.args !== undefined) {
				if (!(commandInfo.args instanceof Array))
					plogger(`Expected args to be an Array but got ${commandInfo.args}`);
				else {
					commandInfo.args.forEach(function(argInfo, index) {
						if (typeof argInfo !== 'object')
							plogger(`Expected argInfo to be an object but got ${argInfo} at index ${index}`);
						else {
							if (typeof argInfo.name !== 'string')
								plogger(`Expected argInfo.name to be a string but got ${argInfo.name} at index ${index}`);
							if (argInfo.subArgs !== undefined)
								validateSubArgs(commandInfo, argInfo.subArgs, prefixWrapper(`subArgs`, plogger));
						}
					});
				}
			}
			if (commandInfo.convertToUnaryOperator !== undefined) {
				if (typeof commandInfo.convertToUnaryOperator !== 'string')
					plogger(`Expected convertToUnaryOperator to either be undefined or a string but got ${commandInfo.convertToUnaryOperator}`);
				else {
					const operatorInfo = Operators.getOperatorInfo(commandInfo.convertToUnaryOperator);
					if (operatorInfo === undefined)
						plogger(`Expected to find a WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found`);
					else if (typeof operatorInfo.unary !== 'object')
						plogger(`Expected to find unary information in the WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found.  Check if the operator is strictly binary.`);
				}
			}
			const optionalBooleanValues = ['isIndependentFunction', 'isReadingRegister', 'isWritingToRegister',
			'removeInMigration', 'reverseArgs', 'wrapAllParametersWithSquareBrackets'];
			for (const key of optionalBooleanValues) {
				if (commandInfo[key] !== undefined && typeof commandInfo[key] !== 'boolean')
					plogger(`Expected ${key} to either be undefined or a boolean but got ${commandInfo[key]}`);
			}
			if (commandInfo.isIndependentFunction && commandInfo.ofClassName !== undefined)
				plogger(`When isIndependentFunction is true, ofClassName should not be specified.  It represents a contradiction to say that the command is from an independent function and yet is a method of class ${commandInfo.ofClassName}`);
			if (typeof commandInfo.to !== 'string' && typeof commandInfo.toProc !== 'string' && typeof commandInfo.description !== 'string')
				plogger(`Expected to, toProc, or description to be a string but neither are.`);
			if (commandInfo.toProc !== undefined) {
				if (typeof commandInfo.toProc !== 'string')
					plogger(`Expected toProc to either be undefined or to be a string but found ${commandInfo.toProc}.`);
				else if (Command.getCommandInfo(commandInfo.toProc) !== undefined)
					plogger(`Expected toProc to not match any command but one was found matching ${commandInfo.toProc}.  Did you mean to use "to" instead of "toProc"?`);
			}
			if (typeof commandInfo.description === 'string' && Command.getCommandInfo(commandInfo.description) !== undefined)
				plogger(`Expected description to not match an existing command but a match was found for description: ${commandInfo.description}.  Did you mean to call the attribute 'to' instead of 'description'?`);
			if (commandInfo.names !== undefined && !(commandInfo.names instanceof Array))
				plogger(`Expected names to be either undefined or an Array but got ${commandInfo.names}.`);
			else if (commandInfo.names instanceof Array) {
				commandInfo.names.forEach(function(name) {
					if (typeof name !== 'string')
						plogger(`Expected all names to be strings but found ${name}`);
					else {
						if (lowerCaseNames.has(name.toLowerCase()))
							plogger(`Expected every primaryName and names element to be distinct in lower case but found duplicate for ${name}`);
						else
							lowerCaseNames.add(name.toLowerCase());
					}
				});
			}
			if (commandInfo.removeInMigration === true) {
				['removeCallTokenOnly', 'to', 'toProc', 'toInline'].forEach(function(key) {
					if (commandInfo[key] !== undefined)
						plogger(`When removeInMigration is true, expected ${key} to be undefined but got ${commandInfo.to}`);
				});
				if (commandInfo.args === undefined && commandInfo.argCount === undefined)
					plogger(`When removeInMigration is specified, args and/or argCount must be specified to determine how many arguments to remove with the command call.  args and argCount were not specified, though.`);
			}
			if (commandInfo.removeCallTokenOnly !== undefined) {
				const removeCallTokenOnly = commandInfo.removeCallTokenOnly;
				if (typeof removeCallTokenOnly !== 'boolean')
					plogger(`removeCallTokenOnly must to be boolean or undefined.  Not: ${removeCallTokenOnly}`);
				else if (removeCallTokenOnly) {
					if (commandInfo.args !== undefined && commandInfo.args.length !== 1)
						plogger(`When removeCallTokenOnly is true, args should either not be specified or indicate 1 in length but you specified ${commandInfo.args.length}.  More than 1 args means removing the call token is very likely going to make at least 1 argument not useful and erroneous in the resulting code.  If 0 args is specified, removeInMigration should be used instead of removeCallTokenOnly.`);;
				}
			}
			validateMigrateToCode(commandInfo, plogger);
			if (commandInfo.reason !== undefined && typeof commandInfo.reason !== 'string')
				plogger(`Expected reason to either be undefined or a string but got ${commandInfo.reason}`);
			if (typeof commandInfo.to === 'string' && Command.getCommandInfo(commandInfo.to) === undefined)
				plogger(`Expected to find a command named ${commandInfo.to} but it is not found in WebLogo.`);
			if (typeof commandInfo.argLengthConditionalTo === 'string' && Command.getCommandInfo(commandInfo.argLengthConditionalTo) === undefined)
				plogger(`Expected to find a command named ${commandInfo.argLengthConditionalTo} but it is not found in WebLogo.`);
			if (commandInfo.toInline !== undefined) {
				if (typeof commandInfo.toInline !== 'string')
					plogger(`toInline must either be undefined or be a string but got ${commandInfo.toInline}`);
			}
			validateArgCount(commandInfo.argCount, plogger);
			checkOnly1Defined(commandInfo, ['to', 'toInline', 'toProc'], plogger);
		});
	}
};