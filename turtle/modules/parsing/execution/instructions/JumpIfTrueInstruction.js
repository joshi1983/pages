import { LogoInstruction } from './LogoInstruction.js';
export class JumpIfTrueInstruction extends LogoInstruction {
	static _name = 'jump-if-true';

	constructor(jumpToIndex, parseTreeToken) {
		super(true, parseTreeToken);
		this.jumpToIndex = jumpToIndex;
	}

	static createFromDTO(dto, token) {
		return new JumpIfTrueInstruction(dto.newIndex, token);
	}

	execute(context) {
		if (context.valueStack.pop())
			context.instructionIndex = this.jumpToIndex;
		else
			context.instructionIndex++; // don't stay on the same instruction forever.
	}

	toDTO() {
		return {
			'name': JumpIfTrueInstruction._name,
			'newIndex': this.jumpToIndex
		};
	}

	setNewIndex(newIndex) {
		if (typeof newIndex !== 'number')
			throw new Error('new index must be a number.');
		this.jumpToIndex = newIndex;
	}
};