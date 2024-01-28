import { AsyncCallCommandInstruction } from '../execution/instructions/AsyncCallCommandInstruction.js';
import { CallCommandInstruction } from '../execution/instructions/CallCommandInstruction.js';
import { Command } from '../Command.js';
await Command.asyncInit();

export function createCallCommandInstruction(commandInfo, token, numArgs) {
	if (numArgs === undefined)
		numArgs = Command.getArgCount(commandInfo).defaultCount;
	if (commandInfo.commandGroup === 'async')
		return new AsyncCallCommandInstruction(commandInfo, numArgs, token);
	else
		return new CallCommandInstruction(commandInfo, numArgs, token);
};