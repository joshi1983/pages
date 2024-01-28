import { LogoInstruction } from './LogoInstruction.js';
export class PopRepcountInstruction extends LogoInstruction {
	static _name = 'pop-repcount';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new PopRepcountInstruction(token);
	}

	execute(context) {
		context.repcountStack.pop();
	}

	toDTO() {
		return {
			'name': PopRepcountInstruction._name
		};
	}
};