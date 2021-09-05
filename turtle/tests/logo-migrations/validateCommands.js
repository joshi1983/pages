import { checkOnly1Defined } from './checkOnly1Defined.js';
import { checkPrimaryName } from './checkPrimaryName.js';
import { Command } from '../../modules/parsing/Command.js';
import { Operators } from '../../modules/parsing/Operators.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { validateArgCount } from './validateArgCount.js';
import { validateArgs } from './validateArgs.js';
import { validateConvertToUnaryOperator } from './validateConvertToUnaryOperator.js';
import { validateHintNames } from './validateHintNames.js';
import { validateMigrateToCode } from './validateMigrateToCode.js';
import { validateRemoveCallTokenOnly } from './validateRemoveCallTokenOnly.js';
import { validateRemoveInMigration } from './validateRemoveInMigration.js';
import { validateToProc } from './validateToProc.js';

await Command.asyncInit();
await Operators.asyncInit();

export function validateCommands(fullInfoObject, logger) {
	if (!(fullInfoObject.commands instanceof Array))
		logger(`Expected a commands Array but got ${fullInfoObject.commands}`);
	else {
		const lowerCaseNames = new Set();
		fullInfoObject.commands.forEach(function(commandInfo, index) {
			const plogger = prefixWrapper(`Command ${index}, primaryName ${commandInfo.primaryName}`, logger);
			if (index > 0 && typeof commandInfo.primaryName === 'string' &&
			typeof fullInfoObject.commands[index - 1].primaryName === 'string' &&
			commandInfo.primaryName.toLowerCase() <= fullInfoObject.commands[index - 1].primaryName.toLowerCase())
				plogger(`Expected to be sorted by primaryName but found a pair out of order.  ${commandInfo.primaryName} and ${fullInfoObject.commands[index - 1].primaryName}`);
			checkPrimaryName(fullInfoObject.primaryName, plogger);
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
			const optionalStrings = ['migrateNewSymbolAtNextLineBreak'];
			optionalStrings.forEach(function(key) {
				if (commandInfo[key] !== undefined &&
				typeof commandInfo[key] !== 'string') {
					plogger(`${key} must either be a string or be left undefined but found ${commandInfo.migrateNewSymbolAtNextLineBreak}`);
				}
			});
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
			validateArgs(commandInfo, plogger);
			validateConvertToUnaryOperator(commandInfo, plogger);
			validateHintNames(commandInfo, plogger);
			validateMigrateToCode(commandInfo, plogger);
			validateRemoveCallTokenOnly(commandInfo, plogger);
			validateRemoveInMigration(commandInfo, plogger);
			validateToProc(commandInfo, plogger);
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