import { JumpIfTrueInstruction } from '../../execution/instructions/JumpIfTrueInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';

/*
If a false value is pushed immediately before running jump-if-true, 
removing the jump-if-true will be more efficient.
*/
export function removeUnneededJumpIfTrue(instructions) {
	for (let i = 1; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof JumpIfTrueInstruction &&
		instructions[i - 1] instanceof PushInstruction && !instructions[i - 1].value) {
			const parseTreeToken = instruction.parseTreeToken;
			removeInstructions(instructions, i - 1, 2);
			i-=2;
		}
	}
};