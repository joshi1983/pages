import { LogoInstruction } from './LogoInstruction.js';
export class JumpInstruction extends LogoInstruction {
	static _name = 'jump';

	constructor(jumpToIndex, parseTreeToken) {
		super(true, parseTreeToken);
		this.jumpToIndex = jumpToIndex;
	}

	static createFromDTO(dto, token) {
		return new JumpInstruction(dto.newIndex, token);
	}

	execute(context) {
		context.instructionIndex = this.jumpToIndex;
	}

	toDTO() {
		return {
			'name': JumpInstruction._name,
			'newIndex': this.jumpToIndex
		};
	}

	setNewIndex(newIndex) {
		if (typeof newIndex !== 'number')
			throw new Error('new index must be a number.');
		this.jumpToIndex = newIndex;
	}
};