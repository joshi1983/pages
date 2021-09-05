import { Command } from '../../parsing/Command.js';
import { CommandCalls } from '../../parsing/parse-tree-analysis/CommandCalls.js';
import { SetUtils } from '../../SetUtils.js';
await Command.asyncInit();
const timeNames = new Set();
const timeCommands = ['animation.clampedTimeRatio', 'animation.time', 'animation.timeRatio'];
timeCommands.forEach(function(name) {
	SetUtils.addAll(timeNames, Command.getLowerCaseCommandNameSet(name));
});
const animationTimeSubstrings = Array.from(timeNames);

export function getAnimationTimeTokens(root) {
	return CommandCalls.getCommandCalls(root, timeCommands);
}

export function isUsingAnimationTime(fastExecuter, code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but got ${code}`);
	if (fastExecuter !== undefined && fastExecuter.program !== undefined) {
		const root = fastExecuter.program.parseTree;
		return getAnimationTimeTokens(root).length !== 0;
	}
	code = code.toLowerCase();
	return animationTimeSubstrings.some(function(substring) {
		return code.indexOf(substring) !== -1;
	});
};