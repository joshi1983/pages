import { mightOutputOrStopBeforeCallingProc } from './mightOutputOrStopBeforeCallingProc.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function mightInstructionListOutputOrStopBeforeCallingProc(procName, listToken, cachedParseTree) {
	const instructions = listToken.children;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (mightOutputOrStopBeforeCallingProc(procName, instruction, cachedParseTree))
				return true;
		}
	}
	return false;
};