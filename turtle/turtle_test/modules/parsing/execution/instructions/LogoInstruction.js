import { ParseTreeToken } from '../../ParseTreeToken.js';

/*
LogoInstruction is a base/super class for all machine-code-like Logo instructions.

Every LogoInstruction should execute in contant time and perform at most 
the work of 1 Logo programming statement.
These instructions are intended to be the smallest units of executable code.
*/
export class LogoInstruction {
	constructor(isControllingInstructionIndex, parseTreeToken) {
		if (typeof isControllingInstructionIndex !== 'boolean')
			throw new Error('LogoInstruction needs a boolean value for isControllingInstructionIndex');
		if (!(parseTreeToken instanceof ParseTreeToken))
			throw new Error('parseTreeToken must be an instance of ParseTreeToken');
		this.isControllingInstructionIndex = isControllingInstructionIndex;
		this.parseTreeToken = parseTreeToken;
	}

	static stringify(instructions) {
		return JSON.stringify(instructions.map(i => i.toDTO()));
	}
}