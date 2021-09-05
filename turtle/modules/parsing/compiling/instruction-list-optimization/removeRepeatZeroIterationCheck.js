import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { JumpIfTrueInstruction } from '../../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../../execution/instructions/JumpInstruction.js';
import { PopInstruction } from '../../execution/instructions/PopInstruction.js';
import { PushFromStackInstruction } from '../../execution/instructions/PushFromStackInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';

/*
Every "repeat" loop is compiled/converted to instructions that check if the number of repetitions is less than 1 before going into the first loop.

It is a little like:
if numRepeats >= 0 [
	do.while [
		; do other instructions.

		repcount++
	] repcount < numRepeats
]

When the number of repetitions is pushed as a constant, the optimizer can do this zero-iteration check and remove it.
In other words, the if-statement can be eliminated if numRepeats is a constant.
*/
export function removeRepeatZeroIterationCheck(instructions) {
	for (let i = 6; i < instructions.length; i++) {
		// look for the instruction sequence corresponding with the zero-check for compiled repeat-loops.
		if (instructions[i] instanceof JumpInstruction &&
			instructions[i - 1] instanceof PopInstruction &&
			instructions[i - 2] instanceof JumpIfTrueInstruction &&
			instructions[i - 3] instanceof BinaryOperatorInstruction &&
			instructions[i - 3].operatorSymbol === '>=' &&
			instructions[i - 4] instanceof PushInstruction &&
			instructions[i - 4].value === 1 &&
			instructions[i - 5] instanceof PushFromStackInstruction &&
			instructions[i - 5].numToPush === 1 &&
			instructions[i - 6] instanceof PushInstruction) {
			const numRepeats = instructions[i - 6].value;
			if (numRepeats >= 1)
				removeInstructions(instructions, i - 5, 6);
		}
	}
};