import { CallCommandInstruction } from '../../../execution/instructions/CallCommandInstruction.js';
import { Command } from '../../../Command.js';
await Command.asyncInit();

export function getInstructionParamRefTypes(instruction, paramIndex) {
	if (instruction instanceof CallCommandInstruction)
		return Command.getParameterRefTypes(instruction.command, paramIndex);
}