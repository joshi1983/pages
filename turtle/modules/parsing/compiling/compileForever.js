import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';

export function compileForever(parseTreeTokens, procedures, result, logger) {
	const firstInstructionIndex = result.length;
	addInstructionsFromCommandList(parseTreeTokens[0], procedures, result, logger);

	result.push(new JumpInstruction(firstInstructionIndex, parseTreeTokens[0]));
};