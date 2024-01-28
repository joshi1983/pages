import { getInstructionsFromToken } from './compileParameters.js';
import { OutputInstruction } from '../execution/instructions/OutputInstruction.js';

export function compileOutput(parseTreeTokens, procedures, result, logger) {
	// calculate value to output
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	result.push(new OutputInstruction(parseTreeTokens[0]));
};