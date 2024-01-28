import { JumpInstruction } from '../execution/instructions/JumpInstruction.js';

export function compileBreak(parseTreeToken, result) {
	result.push(new JumpInstruction(0, parseTreeToken));
};