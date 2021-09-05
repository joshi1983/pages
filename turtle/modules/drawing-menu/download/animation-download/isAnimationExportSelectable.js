import { Code } from '../../../components/code-editor/Code.js';
import { CommandCalls } from '../../../parsing/parse-tree-analysis/CommandCalls.js';

export function isAnimationExportSelectable() {
	if (Code.latestProgram === undefined)
		return false;
	if (Code.latestProgram.procedures.has('animation.setup') ||
	Code.latestProgram.procedures.has('animation.snapshotstyle'))
		return true;
	const timeReadCommands = ['animation.time', 'animation.timeRatio', 'animation.clampedTimeRatio'];
	for (const timeReadCommand of timeReadCommands) {
		const animationTimeCalls = CommandCalls.getCommandCalls(Code.latestProgram.parseTree, timeReadCommand);
		if (animationTimeCalls.length !== 0)
			return true;
	}
	return false;
};