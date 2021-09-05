import { FMSCommand } from
'../../../../modules/parsing/other-languages/fms-logo/FMSCommand.js';

export function testFMSCommand(logger) {
	const info = FMSCommand.getCommandInfo('fd');
	if (typeof info !== 'object')
		logger(`Expected an object for fd but got ${info}`);
};