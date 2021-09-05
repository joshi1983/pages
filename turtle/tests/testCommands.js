import { AlphaColour } from '../modules/AlphaColour.js';
import { Colour } from '../modules/Colour.js';
import { Command } from '../modules/parsing/Command.js';
import { convertToAlphaColour } from '../modules/parsing/execution/instructions/data-type-converters/convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from '../modules/parsing/execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { convertToColour } from '../modules/parsing/execution/instructions/data-type-converters/convertToColour.js';
import { convertToColourOrTransparent } from '../modules/parsing/execution/instructions/data-type-converters/convertToColourOrTransparent.js';
import { convertToDataTypes } from '../modules/parsing/execution/instructions/data-type-converters/convertToDataTypes.js';
import { createTestTurtle } from './helpers/createTestTurtle.js';
import { fetchJson } from '../modules/fetchJson.js';
import { getCommandGroups } from '../modules/command-groups/getCommandGroups.js';
import { isCloseEnough } from './helpers/isCloseEnough.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { Transparent } from '../modules/Transparent.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();
await Command.asyncInit();
const commands = await fetchJson('json/commands.json');

function convertDataTypes(inArray, argsInfo) {
	return inArray.map(function(val, index) {
		const argInfo = argsInfo[index];
		if (argInfo.types === 'color')
			return convertToColour(val);
		if (argInfo.types === 'alphacolor')
			return convertToAlphaColour(val);
		else if (argInfo.types === 'alphacolor|transparent')
			return convertToAlphaColourOrTransparent(val);
		else if (argInfo.types === 'color|transparent')
			return convertToColourOrTransparent(val);
		else if (argInfo.sanitization === 'dataTypes')
			return convertToDataTypes(val);
		else
			return val;
	});
}

function processJSONTestCases(logger) {
	commands.filter(function(commandInfo) {
		return commandInfo.testCases instanceof Array &&
			commandInfo.commandGroup !== 'compiled';
	}).forEach(function(commandInfo) {
		commandInfo.testCases.forEach(function(caseInfo) {
			const turtle = createTestTurtle();
			const commandGroups = getCommandGroups(turtle);
			let inArray = caseInfo.in;
			let plogger = prefixWrapper('Failure while processing ' + JSON.stringify(inArray), logger);
			try {
				if (commandInfo.args !== undefined && commandInfo.args.length === inArray.length && inArray.length > 0) {
					inArray = convertDataTypes(inArray, commandInfo.args);
				}
				if (commandGroups.has(commandInfo.commandGroup)) {
					const obj = commandGroups.get(commandInfo.commandGroup);
					const methodName = Command.getMethodNameFor(commandInfo);
					if (typeof obj[methodName] !== 'function')
						plogger('Unable to find method ' + methodName + ' for command group ' + commandInfo.commandGroup);
					else {
						const actualResult = obj[methodName].apply(obj, inArray);
						if (!isCloseEnough(actualResult, caseInfo.returnValue))
							plogger('Failed test case for command ' + commandInfo.primaryName +
								'. Arguments: ' + JSON.stringify(caseInfo.in) +
								', expected return value of ' + JSON.stringify(caseInfo.returnValue) +
								' but got ' + JSON.stringify(actualResult));
					}
					if (caseInfo.isThrowing === true)
						plogger('Expected to throw an error or exception but did not');
				}
				else
					plogger('Unable to find command group named ' + commandInfo.commandGroup);
			}
			catch (e) {
				if (caseInfo.isThrowing !== true) {
					plogger('error thrown');
					throw e;
				}
			}
		});
	});
}

export function testCommands(logger) {
	wrapAndCall([
		processJSONTestCases
	], logger);
};