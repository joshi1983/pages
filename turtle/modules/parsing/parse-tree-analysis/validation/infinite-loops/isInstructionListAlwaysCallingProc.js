import { isAlwaysCallingProcedure } from './isAlwaysCallingProcedure.js';
import { isOutputBreakOrStopToken } from '../../isOutputBreakOrStopToken.js';
import { mightOutputOrStopBeforeCallingProc } from './mightOutputOrStopBeforeCallingProc.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isInstructionListAlwaysCallingProc(procName, listToken, cachedParseTree) {
	if (listToken.type !== ParseTreeTokenType.LIST)
		return false;

	const instructions = listToken.children;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (isOutputBreakOrStopToken(instruction))
				return false;
			else if (isAlwaysCallingProcedure(procName, instruction, cachedParseTree))
				return true;
			else if (mightOutputOrStopBeforeCallingProc(procName, instruction, cachedParseTree))
				return false;
		}
	}
	return false;
};