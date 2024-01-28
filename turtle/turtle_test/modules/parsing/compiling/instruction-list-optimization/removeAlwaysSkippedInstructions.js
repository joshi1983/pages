import { isJumpSafeInterval } from './instructions-to-JavaScript/isJumpSafeInterval.js';
import { JumpInstruction } from '../../execution/instructions/JumpInstruction.js';
import { removeInstructions } from './removeInstructions.js';

export function removeAlwaysSkippedInstructions(instructions) {
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof JumpInstruction && instruction.jumpToIndex > i &&
		isJumpSafeInterval(instructions, i, instruction.jumpToIndex - 1)) {
			removeInstructions(instructions, i, instruction.jumpToIndex - i);
		}
		else if (Number.isInteger(instruction.jumpToIndex) && instruction.jumpToIndex > i) {
			i = instruction.jumpToIndex;
		}
	}
};