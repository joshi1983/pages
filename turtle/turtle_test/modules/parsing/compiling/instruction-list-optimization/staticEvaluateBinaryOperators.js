/*
Eliminates needless binary operator instructions when only constant values are inputs.
Converts 3 instructions to 1. 
Converts 3 instructions(2 pushes of constants + 1 binary operator instruction) to a single push of 1 constant.
*/
import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { isConstantPush } from './isConstantPush.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';
import { shouldValueBeCloned } from '../shouldValueBeCloned.js';

export function staticEvaluateBinaryOperator(instructions, i) {
	if (!(instructions[i] instanceof BinaryOperatorInstruction))
		throw new Error('i must be the index of a BinaryOperatorInstruction');

	if (isConstantPush(instructions[i - 2]) && isConstantPush(instructions[i - 1]) &&
	instructions[i] instanceof BinaryOperatorInstruction) {
		const val1 = instructions[i - 2].value;
		const val2 = instructions[i - 1].value;
		const result = BinaryOperatorInstruction.evaluate(instructions[i].operatorSymbol, val1, val2);
		const parseTreeToken = instructions[i].parseTreeToken;
		removeInstructions(instructions, i - 1, 2);
		i -= 2;
		instructions[i] = new PushInstruction(result, parseTreeToken, shouldValueBeCloned(result));
		return true;
	}
	return false;
};

export function staticEvaluateBinaryOperators(instructions) {
	for (let i = 2; i < instructions.length; i++) {
		if (instructions[i] instanceof BinaryOperatorInstruction) {
			if (staticEvaluateBinaryOperator(instructions, i)) {
				i -= 2;
			}
		}
	}
};