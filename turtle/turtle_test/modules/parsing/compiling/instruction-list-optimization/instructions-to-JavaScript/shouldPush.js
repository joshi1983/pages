import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { PopInstruction } from '../../../execution/instructions/PopInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

export function shouldPush(instructions, index) {
	const instruction = instructions[index];
	const typesToPush = [BinaryOperatorInstruction, PushInstruction, UnaryOperatorInstruction, VariableReadInstruction];
	for (let i = 0; i < typesToPush.length; i++) {
		if (instruction instanceof typesToPush[i])
			return true;
	}
	if (instruction instanceof CallCommandInstruction &&
	!(instructions[index + 1] instanceof PopInstruction) &&
	instruction.command.returnTypes !== null)
		return true;
	return false;
};