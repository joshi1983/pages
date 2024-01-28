import { LogoInstruction } from './LogoInstruction.js';
export class PopForcountInstruction extends LogoInstruction {
	static _name = 'pop-for-count';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new PopForcountInstruction(token);
	}

	execute(context) {
		context.forcountStack.pop();
	}

	toDTO() {
		return {
			'name': PopForcountInstruction._name
		};
	}
};