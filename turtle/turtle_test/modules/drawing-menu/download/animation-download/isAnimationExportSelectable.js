import { Code } from '../../../components/code-editor/Code.js';
import { CommandCalls } from '../../../parsing/parse-tree-analysis/CommandCalls.js';

export function isAnimationExportSelectable() {
	if (Code.latestProgram === undefined)
		return false;
	if (Code.latestProgram.procedures.has('animation.setup') ||
	Code.latestProgram.procedures.has('animation.snapshotstyle'))
		return true;
	const animationTimeCalls = CommandCalls.getCommandCalls(Code.latestProgram.parseTree, 'animation.time');
	return animationTimeCalls.length !== 0;
};