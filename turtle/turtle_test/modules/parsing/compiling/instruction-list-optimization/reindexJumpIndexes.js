import { JumpInstruction } from '../../execution/instructions/JumpInstruction.js';
import { JumpIfTrueInstruction } from '../../execution/instructions/JumpIfTrueInstruction.js';

function isJumpInstruction(instruction) {
	return instruction instanceof JumpInstruction ||
		instruction instanceof JumpIfTrueInstruction;
}

export function reindexJumpIndexes(instructions, startIndex, indexDelta) {
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (isJumpInstruction(instruction) && instruction.jumpToIndex >= startIndex) {
			instruction.jumpToIndex += indexDelta;
		}
	}
};