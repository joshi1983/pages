import { BinaryOperatorInstruction } from '../../execution/instructions/BinaryOperatorInstruction.js';
import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { CallHighOrderInstruction } from '../../execution/instructions/CallHighOrderInstruction.js';
import { CallProcedureInstruction } from '../../execution/instructions/CallProcedureInstruction.js';
import { PopInstruction } from '../../execution/instructions/PopInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { UnaryOperatorInstruction } from '../../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from '../../execution/instructions/VariableReadInstruction.js';

export function getPushPopBalance(instruction) {
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
	if (instruction instanceof CallHighOrderInstruction)
		return instruction.numArgs;
	if (instruction instanceof CallProcedureInstruction)
		return instruction.procedure.parameters.length - 1;
};

/*
Backtraces the program to find the instruction index that pushes the specified argument.

currentIndex is the index we're starting the search from.  
It might represent a command and numArgs may represent how many arguments we want to jump over before getting to the one of interest.
*/
export function getArgPushIndex(instructions, currentIndex, numArgs) {
	if (numArgs < 0 || currentIndex < 0)
		return undefined;
	if (numArgs === 0) {
		return currentIndex;
	}
	const instruction = instructions[currentIndex];
	const pushPopBalance = getPushPopBalance(instruction);
	if (pushPopBalance !== undefined)
		return getArgPushIndex(instructions, currentIndex - 1, numArgs + pushPopBalance);
};