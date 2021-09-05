import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../Command.js';
await Command.asyncInit();

export function getInstructionParamArgInfo(instruction, paramIndex) {
	if (instruction instanceof CallCommandInstruction)
		return Command.getParameterInfo(instruction.command, paramIndex);
};