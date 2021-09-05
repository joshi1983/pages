import { KTurtleCommand } from '../KTurtleCommand.js';

export function getArgumentCount(token, procedures) {
	let info = KTurtleCommand.getCommandInfo(token.val);
	let argsCount;
	if (info === undefined) {
		const proc = procedures.get(token.val);
		if (proc !== undefined)
			argsCount = proc.parameters.length;
	}
	else if (info.args !== undefined)
		argsCount = info.args.length;
	return argsCount;
};