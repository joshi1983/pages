import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../Command.js';
import { Operators } from '../../../Operators.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
await Operators.asyncInit();
await Command.asyncInit();

export function getInstructionParamTypes(instruction, paramIndex) {
	if (instruction instanceof CallCommandInstruction)
		return Command.getParameterTypes(instruction.command, paramIndex);
	if (instruction instanceof BinaryOperatorInstruction)
		return Operators.getParameterTypes(instruction.operatorSymbol, paramIndex);
	if (instruction instanceof UnaryOperatorInstruction)
		return Operators.getUnaryReturnTypes(instruction.operatorSymbol);
	return '*';
};
