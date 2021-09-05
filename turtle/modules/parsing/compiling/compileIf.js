import { JumpIfTrueInstruction } from '../execution/instructions/JumpIfTrueInstruction.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
import { addInstructionsFromCommandList } from './addInstructionsFromCommandList.js';
import { getInstructionsFromToken } from './compileParameters.js';
await Command.asyncInit();

export function compileIf(parseTreeTokens, procedures, result, logger) {
	if (parseTreeTokens.length < 2)
		throw new Error('An if statement requires 2 child tokens but ' + parseTreeTokens.length + ' are given');
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	result.push(new CallCommandInstruction(Command.getCommandInfo('not'), 1, parseTreeTokens[0]));
	const jumpInstruction = new JumpIfTrueInstruction(0, parseTreeTokens[0]);
	result.push(jumpInstruction);
	addInstructionsFromCommandList(parseTreeTokens[1], procedures, result, logger, true);

	jumpInstruction.setNewIndex(result.length);
};