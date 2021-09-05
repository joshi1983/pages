import { LogoInstruction } from './LogoInstruction.js';
export class OutputInstruction extends LogoInstruction {
	static _name = 'output';

	constructor(parseTreeToken) {
		super(true, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new OutputInstruction(token);
	}

	execute(context) {
		OutputInstruction.executeWithOutputValue(context, context.valueStack.pop());
	}

	static executeWithOutputValue(context, returnValue) {
		const proc = context.procedureStack.pop();
		context.instructionIndex = proc.returnInstructionIndex;
		context.repcountStack.length = proc.repcountStackHeight;
		context.forcountStack.length = proc.forStackHeight;
		context.valueStack.length = proc.valueStackHeight;
		context.valueStack.push(returnValue);
	}

	toDTO() {
		return {
			'name': OutputInstruction._name
		};
	}

};