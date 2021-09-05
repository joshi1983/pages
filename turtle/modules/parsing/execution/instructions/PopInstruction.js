import { LogoInstruction } from './LogoInstruction.js';
export class PopInstruction extends LogoInstruction {
	static _name = 'pop';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new PopInstruction(token);
	}

	execute(context) {
		context.valueStack.pop();
	}

	toDTO() {
		return {
			'name': PopInstruction._name
		};
	}
};