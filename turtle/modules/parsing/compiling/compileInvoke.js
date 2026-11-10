import { CallHighOrderInstruction } from '../execution/instructions/CallHighOrderInstruction.js';
import { getInstructionsFromToken,
	asyncInit as compileParametersAsyncInit } from './compileParameters.js';

export async function asyncInit() {
	await compileParametersAsyncInit();
};

export function compileInvoke(parseTreeTokens, procedures, result, logger) {

	for (let i = 1; i < parseTreeTokens.length; i++) {
		getInstructionsFromToken(parseTreeTokens[i], procedures, result, logger);
	}
	getInstructionsFromToken(parseTreeTokens[0], procedures, result, logger);
	result.push(new CallHighOrderInstruction(parseTreeTokens.length - 1, parseTreeTokens[0]));
};