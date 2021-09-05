import { Command } from '../../modules/parsing/Command.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testCommandArg } from './testCommandArg.js';
import { validateArgCount } from './validateArgCount.js';
import { validateInternalProcArgCount } from './validateInternalProcArgCount.js';
import { validatePrepositionSuffix } from './validatePrepositionSuffix.js';
import { validateReadCommand } from './validateReadCommand.js';
await Command.asyncInit();

const commands = await fetchJson('json/commands.json');

export function testCommandJSONForConsistencyAndValidity(logger) {
	commands.forEach(function(commandInfo, index) {
		const plogger = prefixWrapper(`Command ${index} with primaryName ${commandInfo.primaryName}`, logger);
		if (typeof commandInfo.commandGroup !== 'string')
			plogger('commandGroup must be a string for command at index ' + index + ', primaryName: ' + commandInfo.primaryName);
		const arrayProperties = ['names', 'args', 'hintNames', 'searchKeywords'];
		arrayProperties.forEach(function(arrayName) {
			if (commandInfo[arrayName] !== undefined && !(commandInfo[arrayName] instanceof Array))
				plogger('Command ' + arrayName + ' must be an Array');
		});
		validateInternalProcArgCount(commandInfo, prefixWrapper('validateInternalProcArgCount', plogger));
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
			if (commandInfo.args.filter(a => a.refTypes !== undefined).length === 0 &&
			'setProperty2' !== commandInfo.primaryName) {
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
		validatePrepositionSuffix(commandInfo, plogger);
		validateArgCount(commandInfo, plogger);
	});
};