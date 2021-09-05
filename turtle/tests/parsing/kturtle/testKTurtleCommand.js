import { KTurtleCommand } from '../../../modules/parsing/kturtle/KTurtleCommand.js';

export function testKTurtleCommand(logger) {
	const info = KTurtleCommand.getCommandInfo('print');
	if (typeof info !== 'object')
		logger(`Expected info to be an object but got ${info}`);
	else if (!(info.args instanceof Array))
		logger(`Expected info.args to be an Array but got ${info.args}`);
	
};