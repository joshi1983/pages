import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { CallProcedureInstruction } from '../../../execution/instructions/CallProcedureInstruction.js';
import { PopInstruction } from '../../../execution/instructions/PopInstruction.js';
import { PushInstruction } from '../../../execution/instructions/PushInstruction.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from '../../../execution/instructions/VariableReadInstruction.js';

function getPushPopBalance(instruction) {
	if (instruction instanceof PushInstruction || instruction instanceof VariableReadInstruction)
		return -1;
	if (instruction instanceof PopInstruction)
		return 1;
	if (instruction instanceof BinaryOperatorInstruction)
		return 1;
	if (instruction instanceof UnaryOperatorInstruction)
		return 0;
	if (instruction instanceof CallCommandInstruction)
		return instruction.numArgs - 1;
	if (instruction instanceof CallProcedureInstruction)
		return instruction.procedure.parameters.length - 1;
}

export function getStartIndexForInstructionCluster(instructions, index) {
	let overallBalance = 1 + getPushPopBalance(instructions[index]);
	if (overallBalance === 0)
		return index;
	for (let i = index - 1; i >= 0; i--) {
		const instruction = instructions[i];
		const pushPopBalance = getPushPopBalance(instruction);
		overallBalance += pushPopBalance;
		if (overallBalance === 0)
			return i;
		else if (overallBalance < 0)
			return undefined;
	}
};