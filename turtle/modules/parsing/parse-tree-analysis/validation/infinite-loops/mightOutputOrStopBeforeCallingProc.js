import { Command } from '../../../Command.js';
import { isAlwaysCallingProcedure } from './isAlwaysCallingProcedure.js';
import { mightInstructionListOutputOrStopBeforeCallingProc } from './mightInstructionListOutputOrStopBeforeCallingProc.js';
await Command.asyncInit();

export function mightOutputOrStopBeforeCallingProc(procName, instruction, cachedParseTree) {
	const commandInfo = Command.getCommandInfo(instruction.val);
	if (commandInfo !== undefined) {
		if (['output', 'stop'].indexOf(commandInfo.primaryName) !== -1)
			return true;
		else if (['for', 'if', 'repeat', 'while'].indexOf(commandInfo.primaryName) !== -1 &&
		instruction.children.length === 2) {
			if (mightInstructionListOutputOrStopBeforeCallingProc(procName, instruction.children[1], cachedParseTree))
				return true;
		}
		else if (isAlwaysCallingProcedure(procName, instruction, cachedParseTree))
			return false;
	}
	return false;
};