import { Command } from '../../../modules/parsing/Command.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { isNumber } from '../../../modules/isNumber.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
const pythonTurtleFunctions = await fetchJson('json/logo-migrations/python/pythonTurtle.json');
await Command.asyncInit();
await DataTypes.asyncInit();

function testNoDuplicateNames(logger) {
	const names = new Set();
	pythonTurtleFunctions.forEach(function(funcInfo, functionIndex) {
		if (funcInfo.names instanceof Array) {
			funcInfo.names.forEach(function(name) {
				if (names.has(name))
					logger(`Duplicate name found ${name} at function index ${functionIndex}`);
				else
					names.add(name);
			});
		}
	});
}

function validateArgCount(funcInfo, logger) {
	if (typeof logger !== 'function')
		throw new Error(`validateArgCount logger must be a function but logger=${logger}`);
	const argCount = funcInfo.argCount;
	if (isNumber(argCount) && funcInfo.args !== undefined && funcInfo.args.length !== argCount) {
		logger(`argCount of ${argCount} should equal args.length of ${funcInfo.args.length}`);
	}
	if (['number', 'object'].indexOf(typeof argCount) === -1)
		logger(`argCount must either be an object or a number.  Not ${typeof argCount}`);
	else if (typeof argCount === 'number') {
		if (false === Number.isInteger(argCount))
			logger(`argCount must be an integer if it is a number.  Not: ${argCount}`);
	}
	else if (typeof argCount === 'object') {
		if (false === Number.isInteger(argCount.min) || argCount.min < 0)
			logger(`min must be a positive integer.  Not: ${argCount.min}`);
		if (false === Number.isInteger(argCount.max) || argCount.max < 1)
			logger(`max must be an integer at least 1.  Not: ${argCount.max}`);
		if (argCount.max <= argCount.min)
			logger(`max must be strictly greater than min. max=${argCount.max}, min=${argCount.min}`);
	}
	if ((funcInfo.treatThreeArgsAsSingleColor === true ||
	funcInfo.groupTwoArgsAsList === true) && argCount !== 1) {
		if (typeof argCount !== 'object')
			logger(`argCount must be either 1 or be an object when treatThreeArgsAsSingleColor or groupTwoArgsAsList are true but got ${argCount}`);
		else if (argCount.min > 1)
			logger(`argCount.min expected to be 1 or less since treatThreeArgsAsSingleColor or groupTwoArgsAsList are specified. argCount.min = ${argCount.min}`);
	}
}

function validateArgsArray(funcInfo, logger) {
	if (funcInfo.args === undefined)
		return;
	if (!(funcInfo.args instanceof Array))
		logger(`If args is specified, it must be an Array.  Not: ${funcInfo.args}`);
	else {
		
	}
}

function validateClassName(className, logger) {
	const validClassNames = ['colorsys', 'math', 'random', 'screen', 'string',
		'time', 'turtle', 'window'];
	if (typeof className !== 'string')
		logger(`class must be a string.  Not: ${className}`);
	else if (validClassNames.indexOf(className) === -1) {
		logger(`All valid class names are ${validClassNames.join(' ')}.  You specified ${className}`);
	}
}

function validateNames(names, logger) {
	if (!(names instanceof Array))
		logger(`names must be an Array.  Not: ${names}`);
	else if (names.length === 0)
		logger('names must have a length of at least 1');
	else {
		for (let i = 0; i < names.length; i++) {
			if (typeof names[i] !== 'string')
				logger(`Every name must be a string but found something else at index ${i}`);
		}
	}
}

function validateTranslateInstanceToFirstArg(funcInfo, logger) {
	const translateInstanceToFirstArg = funcInfo.translateInstanceToFirstArg;
	if (translateInstanceToFirstArg !== undefined) {
		if (translateInstanceToFirstArg !== true)
			logger(`translateInstanceToFirstArg should either be undefined or true but found ${translateInstanceToFirstArg}`);
		else {
			if (funcInfo.className === undefined)
				logger(`When translateInstanceToFirstArg is true, className should also be specified.`);
		}
	}
}

function validatePythonFunctionInfo(funcInfo, logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but logger=${logger}`);
	if (typeof funcInfo !== 'object')
		logger(`Function information expected to be an object.  Not: ${funcInfo}`);
	else if (funcInfo.translateToCommand === undefined && funcInfo.translateToCommands === undefined)
		logger(`Either translateToCommand or translateToCommands must be specified`);
	else {
		validateClassName(funcInfo.className, prefixWrapper('validateClassName', logger));
		validateNames(funcInfo.names, prefixWrapper('validateNames', logger));
		wrapAndCall([
			validateArgCount,
			validateArgsArray,
			validateTranslateInstanceToFirstArg,
			validateTranslateToCommandInfo
		], logger, funcInfo);
		validateTrueOrUndefined(funcInfo.groupTwoArgsAsList, prefixWrapper('groupTwoArgsAsList', logger));
		validateTrueOrUndefined(funcInfo.treatThreeArgsAsSingleColor, prefixWrapper('treatThreeArgsAsSingleColor', logger));
		if (funcInfo.migrateToCode !== undefined) {
			if (typeof funcInfo.migrateToCode !== 'string') {
				logger(`migrateToCode should be a string but found ${funcInfo.migrateToCode}`);
			}
		}
	}
}

function validateTrueOrUndefined(val, logger) {
	if (val === undefined || val === true)
		return; // no problem.
	if (val === false)
		logger('Not specifying at all would be shorter than setting it to false and have the same effect.');
	else
		logger(`Should be either undefined or true.  Not: ${val}`);
}

function validateWebLogoCommandPrimaryName(primaryName, logger) {
	if (typeof primaryName !== 'string') {
		logger(`primary name must be a string.  Not: ${primaryName} which has type ${typeof primaryName}`);
		return;
	}
	const commandInfo = Command.getCommandInfo(primaryName);
	if (commandInfo === undefined)
		logger(`No command found matching name: ${primaryName}`);
	else if (commandInfo.primaryName !== primaryName)
		logger(`A matching command was found for ${primaryName} but the exact primaryName was ${commandInfo.primaryName}`);
}

function validateTranslateToCommandInfo(funcInfo, logger) {
	if (funcInfo.translateToCommand !== undefined) {
		if (funcInfo.translateToCommand !== null && funcInfo.isConstant !== true) {
			if (funcInfo.isTranslatedToProcedure !== true) {
				validateWebLogoCommandPrimaryName(funcInfo.translateToCommand, prefixWrapper('validateWebLogoCommandPrimaryName for translateToCommand', logger));
			}
			else {
				if (typeof funcInfo.returnTypes !== 'string' && funcInfo.returnTypes !== null) {
					logger(`When isTranslatedToProcedure is true, returnTypes must be specified in a similar way to how they are in commands.json.`);
				}
				else {
					new DataTypes(funcInfo.returnTypes);
				}
			}
		}
	}
	if (funcInfo.translateToCommands !== undefined) {
		if (!(funcInfo.translateToCommands instanceof Array))
			logger(`translateToCommands must be an Array. Not: ${funcInfo.translateToCommands}`);
		else
			funcInfo.translateToCommands.forEach(function(primaryName, index) {
				validateWebLogoCommandPrimaryName(primaryName, prefixWrapper(`validateWebLogoCommandPrimaryName for translateToCommands index ${index}`, logger));
			});
	}
}

export function testPythonTurtleJSON(logger) {
	if (!(pythonTurtleFunctions instanceof Array))
		logger(`Array expected but got ${pythonTurtleFunctions}`);
	else {
		pythonTurtleFunctions.forEach(function(funcInfo, index) {
			const names = funcInfo.names instanceof Array ? funcInfo.names.join(',') : 'no names';
			validatePythonFunctionInfo(funcInfo, prefixWrapper(`Function ${index}, with names ${names}`, logger));
		});
		testNoDuplicateNames(prefixWrapper('validateNoDuplicateNames', logger));
	}
};