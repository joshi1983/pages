import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken,
	asyncInit as compileParametersAsyncInit } from './compileParameters.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { setBreakJumpIndexesTo } from './setBreakJumpIndexesTo.js';

export async function asyncInit() {
	await Command.asyncInit();
	await compileParametersAsyncInit();
};

export function compileUntil(parseTreeTokens, procedures, result, logger) {
	const firstInstructionIndex = result.length;
	const untilInstructionsToken = parseTreeTokens[0];
	const untilToken = untilInstructionsToken.parentNode;
	getInstructionsFromToken(untilInstructionsToken, procedures, result, logger);
	const jumpInstruction = new JumpIfTrueInstruction(0, parseTreeTokens[0]);
	result.push(jumpInstruction);
	addInstructionsFromCommandList(parseTreeTokens[1], procedures, result, logger);

	result.push(new JumpInstruction(firstInstructionIndex, parseTreeTokens[0]));
	jumpInstruction.setNewIndex(result.length);
	setBreakJumpIndexesTo(result.length, result.length - 1, result, untilToken);
};