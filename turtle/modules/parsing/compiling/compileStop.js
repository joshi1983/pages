import { OutputNullInstruction } from '../execution/instructions/OutputNullInstruction.js';

export function compileStop(parseTreeToken, result) {
	result.push(new OutputNullInstruction(parseTreeToken));
};