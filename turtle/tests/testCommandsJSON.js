import { Command } from '../modules/parsing/Command.js';
import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
await Command.asyncInit();

const commands = await fetchJson('json/commands.json');

function testCommandArg(commandInfo, arg, argIndex, plogger) {
	if (typeof arg.name !== 'string')
		plogger('Missing an argument name for argument index ' + argIndex);
	if (typeof arg.types !== 'string')
		plogger('Missing argument types for argument index ' + argIndex);
	else if (arg.types.toLowerCase() !== arg.types)
		plogger('arg.types must always be in lower case.  This is not the case for argument at index ' + argIndex + '.  types = ' + arg.types);
	if (arg.min !== undefined && typeof arg.min !== 'number')
		plogger('Should either set min to a number or not set it at all.  Instead min is set to ' + arg.min);
	if (arg.max !== undefined && typeof arg.max !== 'number')
		plogger('Should either set max to a number or not set it at all.  Instead max is set to ' + arg.max);
	if (arg.uselessCases !== undefined && !(arg.uselessCases instanceof Array))
		plogger('uselessCases should be an Array.  Instead uselessCases is set to ' + arg.uselessCases);
	if (arg.errorCases !== undefined && !(arg.errorCases instanceof Array))
		plogger('errorCases should be an Array.  Instead errorCases is set to ' + arg.errorCases);
	if (arg.minLen !== undefined && !Number.isInteger(arg.minLen))
		plogger('Should either set minLen to an integer number or not set it at all.  Instead minLen is set to ' + arg.minLen);
	if (arg.listElementTypes !== undefined && typeof arg.listElementTypes !== 'string')
		plogger('Should either set listElementTypes to a string or not set it at all.  Instead listElementTypes is set to ' + arg.listElementTypes);
	if (arg.sanitization !== undefined && typeof arg.sanitization !== 'string') {
		// should match methods on the JavaScriptInstruction class.
		plogger('sanitization should either be undefined or a string');
	}
	if (arg.format !== undefined) {
		if (typeof arg.format !== 'string')
			plogger('format must be either undefined or a string.  Not: ' + arg.format);
	}
	if (arg.typeEqualitySymbol !== undefined) {
		if (arg.disableTypeEqualitySymbolIfTypes !== undefined) {
			if (typeof arg.disableTypeEqualitySymbolIfTypes !== 'string')
				plogger(`disableTypeEqualitySymbolIfTypes expected to be a data types expression string but got: ${arg.disableTypeEqualitySymbolIfTypes}`);
		}
		if (typeof arg.typeEqualitySymbol !== 'string') {
			plogger('typeEqualitySymbol must be either undefined or a string');
		}
		else {
			const matches = commandInfo.args.filter(a => a.typeEqualitySymbol === arg.typeEqualitySymbol);
			if (matches.length === 1)
				plogger('typeEqualitySymbol must have more than 1 match for the same name but only one was found for typeEqualitySymbol of ' + arg.typeEqualitySymbol);
		}
	}
}

function validateArgCount(commandInfo, logger) {
	if (commandInfo.argCount !== undefined) {
		if (typeof commandInfo.argCount === 'string') {
			if (commandInfo.argCount !== '?')
				logger('If argCount is a string, it should be \'?\' but got ' + commandInfo.argCount);
		}
		else if (typeof commandInfo.argCount === 'object') {
			['default', 'min', 'max'].forEach(function(key) {
				const val = commandInfo.argCount[key];
				if (typeof val !== 'number' && val !== undefined)
					logger(`If argCount.${key} is specified, it should be a number.  Not: ${val}`);
			});
		}
		else
			logger('If argCount is specified, it should either be "?" or an object defining either min or max');
	}
}

function validateReadCommand(commandInfo, logger) {
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
}

function testCommandJSONForConsistencyAndValidity(logger) {
	commands.forEach(function(commandInfo, index) {
		const plogger = prefixWrapper(`Command ${index} with primaryName ${commandInfo.primaryName}`, logger);
		if (typeof commandInfo.commandGroup !== 'string')
			plogger('commandGroup must be a string for command at index ' + index + ', primaryName: ' + commandInfo.primaryName);
		const arrayProperties = ['names', 'args', 'hintNames', 'searchKeywords'];
		arrayProperties.forEach(function(arrayName) {
			if (commandInfo[arrayName] !== undefined && !(commandInfo[arrayName] instanceof Array))
				plogger('Command ' + arrayName + ' must be an Array');
		});
		if (commandInfo.args instanceof Array) {
			commandInfo.args.forEach(function(arg, argIndex) {
				testCommandArg(commandInfo, arg, argIndex, plogger);
			});
		}
		if (!(commandInfo.names instanceof Array))
			plogger('Command must have a names property');
		else {
			commandInfo.names.forEach(function(name) {
				if (typeof name !== 'string')
					plogger('names must be an Array of nothing but strings');
				else if (name.indexOf("?") !== -1) {
					if (commandInfo.returnTypes !== 'bool')
						plogger('returnTypes of bool expected when ? is found in a command name.  Command primaryName = ' + commandInfo.primaryName);
					if (!commandInfo.primaryName.endsWith("p"))
						plogger('When an alternate name contains ?, the primaryName is expected to end with "p".  That is not the case for the command with primaryName ' + commandInfo.primaryName);
				}
			});
		}
		if (typeof commandInfo.description !== 'string')
			plogger('Command description must be a string');
		if (typeof commandInfo.returnTypes !== 'string' && commandInfo.returnTypes !== null)
			plogger('Command returnTypes must be string or null');
		if (commandInfo.isStaticEvaluationSafe !== undefined && typeof commandInfo.isStaticEvaluationSafe !== 'boolean')
			plogger('isStaticEvaluationSafe must either be undefined or boolean.  Instead, it was assigned ' + commandInfo.isStaticEvaluationSafe);
		else if (commandInfo.isStaticEvaluationSafe) {
			if (commandInfo.commandGroup === 'turtle' || commandInfo.commandGroup === 'compiled') {
				plogger(commandInfo.commandGroup + ' commands are not expected to be isStaticEvaluationSafe but one is indicated safe');
			}
			if (commandInfo.returnTypes === null)
				plogger('isStaticEvaluationSafe should not be set for a command that returns null but one is indicated safe');
		}
		if (commandInfo.isAsync !== undefined) {
			if (typeof commandInfo.isAsync !== 'boolean')
				plogger(`isAsync should either be undefined or boolean but found ${commandInfo.isAsync}`);
			if (commandInfo.groupName === 'async')
				plogger(`isAsync is implied to be true for every command in group async.  You specified it to be ${commandInfo.isAsync}.`);
		}
		if (typeof commandInfo.isIndependentlyUseful !== 'boolean')
			plogger('Command isIndependentlyUseful should be a boolean but is not at index ' + index + ', primaryName = ' + commandInfo.primaryName);
		else if (commandInfo.isIndependentlyUseful && ['turtle', 'compiled', 'random'].indexOf(commandInfo.commandGroup) === -1) {
			if (commandInfo.args.filter(a => a.refTypes !== undefined).length === 0) {
				plogger('isIndependentlyUseful tends to be true only for turtle or compiled or random commandGroup commands or they have refTypes set on an argument.  ' +
					commandInfo.primaryName + ' is of commandGroup ' + commandInfo.commandGroup + ' and yet is marked isIndependentlyUseful');
			}
		}
		if (commandInfo.isConsecutiveRepeatRedundant !== undefined) {
			if (typeof commandInfo.isConsecutiveRepeatRedundant !== 'boolean')
				plogger('isConsecutiveRepeatRedundant must always be either true, false, or not be specified at all.  This is violated');
			else if (!commandInfo.isIndependentlyUseful)
				plogger('isConsecutiveRepeatRedundant should not be specified when isIndependentlyUseful is false.  This is violated');
		}
		validateReadCommand(commandInfo, plogger);
		validateArgCount(commandInfo, plogger);
	});
}

export function testCommandsJSON(logger) {
	testCommandJSONForConsistencyAndValidity(prefixWrapper('testCommandJSONForConsistencyAndValidity', logger));
};