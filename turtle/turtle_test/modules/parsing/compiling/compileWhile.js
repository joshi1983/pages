import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { getInstructionsFromToken } from './compileParameters.js';
import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';
import { setBreakJumpIndexesTo } from './setBreakJumpIndexesTo.js';
await Command.asyncInit();

export function compileWhile(parseTreeTokens, procedures, result, logger) {
	const firstInstructionIndex = result.length;
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	result.push(new CallCommandInstruction(Command.getCommandInfo('not'), 1, parseTreeTokens[0]));
	const jumpInstruction = new JumpIfTrueInstruction(0, parseTreeTokens[0]);
	result.push(jumpInstruction);
	addInstructionsFromCommandList(parseTreeTokens[1], procedures, result, logger);

	result.push(new JumpInstruction(firstInstructionIndex, parseTreeTokens[0]));
	jumpInstruction.setNewIndex(result.length);
	setBreakJumpIndexesTo(result.length, result.length - 1, result);
};