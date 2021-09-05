import { CommandsToJS } from
'../../../../modules/parsing/compiling/to-js/CommandsToJS.js';

export function testCommandsToJS(logger) {
	const info = CommandsToJS.getCommandInfo('PRINT');
	if (typeof info !== 'object')
		logger(`Expected to find an object but found ${info}`);
};