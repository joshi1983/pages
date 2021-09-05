import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../Command.js';

export function getInstructionParamSanitization(instruction, paramIndex) {
	if (instruction instanceof CallCommandInstruction)
		return Command.getParameterSanitization(instruction.command, paramIndex);
}