import { LogoInstruction } from './LogoInstruction.js';
export class PushMaxRepcountInstruction extends LogoInstruction {
	static _name = 'push-max-repcount';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new PushMaxRepcountInstruction(token);
	}

	execute(context) {
		const max = Math.floor(context.valueStack.pop());
		context.repcountStack.push({'max': max, 'current': 1});
	}

	toDTO() {
		return {
			'name': PushMaxRepcountInstruction._name
		};
	}
};