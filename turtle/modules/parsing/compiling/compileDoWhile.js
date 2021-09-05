import { Command } from '../Command.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { getInstructionsFromToken } from './compileParameters.js';
await Command.asyncInit();

export function compileDoWhile(parseTreeTokens, procedures, result, logger) {
	const firstInstructionIndex = result.length;

	addInstructionsFromCommandList(parseTreeTokens[0], procedures, result, logger);

	getInstructionsFromToken(parseTreeTokens[1], procedures, result, logger);
	const jumpInstruction = new JumpIfTrueInstruction(firstInstructionIndex, parseTreeTokens[1]);
	result.push(jumpInstruction);
};