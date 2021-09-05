import { Command } from '../modules/parsing/Command.js';
import { createTestDrawing } from './helpers/createTestDrawing.js';
import { createTestTurtle } from './helpers/createTestTurtle.js';
import { fetchJson } from '../modules/fetchJson.js';
import { getCommandGroups } from '../modules/command-groups/getCommandGroups.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
await Command.asyncInit();
const commands = await fetchJson('json/commands.json');

function shouldBeSkipped(info) {
	const primaryName = info.primaryName;
	return ['closePath', 'fillGradient', 'penGradient', 'polyEnd'].indexOf(primaryName) !== -1;
}

export function testCommandsJSONCallNoArgumentCommands(logger) {
	const turtle = createTestTurtle();
	const commandGroups = getCommandGroups(turtle);
	if (typeof turtle.heading !== 'function')
		logger('turtle should have a heading method but does not');

	commands.forEach(function(commandInfo, index) {
		const plogger = prefixWrapper(`Command at index ${index} with primary name: ${commandInfo.primaryName}`, logger);
		if (typeof commandInfo.primaryName !== 'string')
			plogger('A command was found without the required string primaryName at index ' + index);
		else if (commandInfo.commandGroup !== 'compiled') {
			const obj = commandGroups.get(commandInfo.commandGroup);
			const methodName = Command.getMethodNameFor(commandInfo);
			if (commandInfo.commandGroup === 'drawing')
				turtle.settings.drawing = createTestDrawing();
			else
				turtle.settings.drawing = undefined;
			if (typeof obj[methodName] !== 'function')
				plogger(commandInfo.commandGroup + ' is missing command named ' + commandInfo.primaryName + '.  The method name should be ' + methodName);
			else if (commandInfo.args instanceof Array && commandInfo.args.length === 0 && !shouldBeSkipped(commandInfo)) {
				// call the function with no arguments since none are required.
				const result = obj[methodName]();
				if (commandInfo.returnTypes !== null) {
					if (result === null || result === undefined)
						plogger(`Return types are expected to be ${commandInfo.returnTypes} but got ${result}`);
				}
			}
		}
	});
}