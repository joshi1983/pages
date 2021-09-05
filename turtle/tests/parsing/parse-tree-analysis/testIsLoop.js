import { Command } from '../../../modules/parsing/Command.js';
import { loopCommandNames } from '../../../modules/parsing/parse-tree-analysis/isLoop.js';
await Command.asyncInit();

export function testIsLoop(logger) {
	loopCommandNames.forEach(function(commandName) {
		const info = Command.getCommandInfo(commandName);
		for (let i = 0; i < info.args.length; i++) {
			if (info.args[i].types === 'instructionlist')
				return;
		}
		logger('instructionlist must be in every loop command but it was not found for command: ' + info.primaryName);
	});
};