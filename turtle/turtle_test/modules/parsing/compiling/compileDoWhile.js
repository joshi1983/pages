import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { setBreakJumpIndexesTo } from './setBreakJumpIndexesTo.js';
await Command.asyncInit();

export function compileDoWhile(parseTreeTokens, procedures, result, logger) {
	const firstInstructionIndex = result.length;

	addInstructionsFromCommandList(parseTreeTokens[0], procedures, result, logger);

	getInstructionsFromToken(parseTreeTokens[1], procedures, result, logger);
	const jumpInstruction = new JumpIfTrueInstruction(firstInstructionIndex, parseTreeTokens[1]);
	result.push(jumpInstruction);
	setBreakJumpIndexesTo(result.length, result.length - 1, result);
};