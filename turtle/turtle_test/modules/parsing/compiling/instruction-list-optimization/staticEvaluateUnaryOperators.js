/*
Eliminates needless binary operator instructions when only constant values are inputs.
Converts 2 instructions to 1. 
Converts 2 instructions(1 pushes of constant + 1 unary operator instruction) to a single push of 1 constant.
*/
import { UnaryOperatorInstruction } from '../../execution/instructions/UnaryOperatorInstruction.js';
import { isConstantPush } from './isConstantPush.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';
import { shouldValueBeCloned } from '../shouldValueBeCloned.js';

export function staticEvaluateUnaryOperators(instructions) {
	for (let i = 1; i < instructions.length; i++) {
		if (isConstantPush(instructions[i - 1]) &&
		instructions[i] instanceof UnaryOperatorInstruction) {
			const val1 = instructions[i - 1].value;
			const result = UnaryOperatorInstruction.evaluate(instructions[i].operatorSymbol, val1);
			const parseTreeToken = instructions[i].parseTreeToken;
			removeInstructions(instructions, i - 1, 1);
			i --;
			instructions[i] = new PushInstruction(result, parseTreeToken, shouldValueBeCloned(result));
		}
	}
};