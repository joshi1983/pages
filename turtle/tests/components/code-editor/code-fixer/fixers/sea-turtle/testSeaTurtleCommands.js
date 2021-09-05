import { SeaTurtleCommands } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/SeaTurtleCommands.js';

export function testSeaTurtleCommands(logger) {
	const setInfo = SeaTurtleCommands.getCommandInfo('set');
	if (typeof setInfo !== 'object')
		logger(`setInfo expected to be an object but found ${setInfo}`);

	const names = SeaTurtleCommands.getAllNames();
	if (!(names instanceof Array))
		logger(`getAllNames() expected to return an Array but got ${names}`);
	else if (names.length === 0)
		logger(`getAllNames() expected to return more than 1 name but found none`);
};