import { Command } from '../../Command.js';
import { OutputFrequency } from './OutputFrequency.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

const instructionListPrimaryNames = new Set(Command.getCommandsWithInstructionLists().
	filter(c => c.primaryName !== 'to').
	map(c => c.primaryName));

function hasInstructionListChild(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	// if the token does not have a valid number of arguments for a loop,
	// assume it is not a loop.
	if (info.args.length !== token.children.length)
		return false;
	return instructionListPrimaryNames.has(info.primaryName);
}

export function getOutputFrequencyAdvanced(instructionListToken, tokenToOutputFrequency, repeatCounts) {
	const children = instructionListToken.children;
	let maybe = false;
	for (let i = 0; i < children.length; i++) {
		const token = children[i];
		if (hasInstructionListChild(token)) {
			const info = Command.getCommandInfo(token.val);
			for (let j = 0; j < info.args.length; j++) {
				const paramToken = token.children[j];
				if (info.args[j].types === 'instructionlist') {
					if (!tokenToOutputFrequency.has(paramToken))
						return; // return undefined as in can't be computed right now.
					// this is different from MaybeDecided.Maybe in that more work on repeatCounts
					// may get a more informative result like MaybeDecided.Yes or MaybeDecided.No.
					else {
						const childOutputFrequency = tokenToOutputFrequency.get(paramToken);
						const count = repeatCounts.get(paramToken);
						if (count === undefined) { // unknown number of repetitions
							if (childOutputFrequency !== OutputFrequency.Never)
								maybe = true;
						}
						else {
							if (count.min !== 0) { // if the instruction list definitely runs.
								if (childOutputFrequency === OutputFrequency.Always) // running the list always outputs
									return OutputFrequency.Always;
								else if (childOutputFrequency === OutputFrequency.Sometimes)
									maybe = true;
							}
							if (count.max !== 0) { // might run instruction list
								if (childOutputFrequency !== OutputFrequency.Never) // Running the list yes or maybe outputs?
									maybe = true; // then, the parent instruction list may output here too.
							}
						}
					}
				}
			}
		}
	}
	if (maybe)
		return OutputFrequency.Sometimes;
	else
		return OutputFrequency.Never;
}