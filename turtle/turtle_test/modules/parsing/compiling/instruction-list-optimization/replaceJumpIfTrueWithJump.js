import { JumpIfTrueInstruction } from '../../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../execution/instructions/JumpInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';

/*
If a true value is pushed immediately before running jump-if-true, an unconditional jump will be more efficient.
*/
export function replaceJumpIfTrueWithJump(instructions) {
	for (let i = 1; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof JumpIfTrueInstruction &&
		instructions[i - 1] instanceof PushInstruction && instructions[i - 1].value) {
			let jumpToIndex = instruction.jumpToIndex;
			const parseTreeToken = instruction.parseTreeToken;
			removeInstructions(instructions, i, 1);
			if (jumpToIndex >= i)
				jumpToIndex--;
			i--;
			instructions[i] = new JumpInstruction(jumpToIndex, parseTreeToken);
		}
	}
};