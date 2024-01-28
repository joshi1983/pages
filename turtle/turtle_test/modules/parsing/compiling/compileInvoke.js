import { CallHighOrderInstruction } from '../execution/instructions/CallHighOrderInstruction.js';
import { getInstructionsFromToken } from './compileParameters.js';

export function compileInvoke(parseTreeTokens, procedures, result, logger) {

	for (let i = 1; i < parseTreeTokens.length; i++) {
		getInstructionsFromToken(parseTreeTokens[i], procedures, result, logger);
	}
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	result.push(new CallHighOrderInstruction(parseTreeTokens.length - 1, parseTreeTokens[0]));
};