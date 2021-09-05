import { AlphaColour } from '../modules/AlphaColour.js';
import { Colour } from '../modules/Colour.js';
import { Command } from '../modules/parsing/Command.js';
import { convertArgsUsingArgsInfo } from
'../modules/parsing/execution/instructions/data-type-converters/convertArgsUsingArgsInfo.js';
import { convertToDataTypes } from
'../modules/parsing/execution/instructions/data-type-converters/convertToDataTypes.js';
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

function processJSONTestCases(logger) {
	commands.filter(function(commandInfo) {
		return commandInfo.testCases instanceof Array &&
			commandInfo.commandGroup !== 'compiled';
	}).forEach(function(commandInfo) {
		commandInfo.testCases.forEach(function(caseInfo) {
			const turtle = createTestTurtle();
			const commandGroups = getCommandGroups(turtle);
			let inArray = caseInfo.in;
			let plogger = prefixWrapper(`primaryName: ${commandInfo.primaryName}, Failure while processing ${JSON.stringify(inArray)}`, logger);
			try {
				if (commandInfo.args !== undefined && commandInfo.args.length === inArray.length && inArray.length > 0) {
					//inArray = convertToDataTypes(inArray, commandInfo.args);
					inArray = convertArgsUsingArgsInfo(inArray, commandInfo.args);
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
					plogger(`error thrown. e=${e}`);
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