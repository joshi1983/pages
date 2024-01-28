import { Command } from '../../parsing/Command.js';
import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';

export class CommandConstraint {
	constructor(primaryName) {
		// chop off the preceding 'cmd:' if it is there.
		const index = primaryName.indexOf(':');
		if (index !== -1)
			primaryName = primaryName.substring(index + 1);

		// Get the name exactly right, if possible.
		const info = Command.getCommandInfo(primaryName);
		if (info !== undefined)
			primaryName = info.primaryName;
		this.primaryName = primaryName;
	}

	static isCommand(part) {
		return part.startsWith('cmd:');
	}

	isMatching(example) {
		const tree = ScriptExampleDisplayRepository.getParseTree(example.filename);
		if (tree === undefined)
			return false;
		const calls = tree.getCommandCallsByName(this.primaryName);
		return calls.length !== 0;
	}
};