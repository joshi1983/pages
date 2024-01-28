import { LogoInstruction } from './LogoInstruction.js';
export class IncrementRepcountInstruction extends LogoInstruction {
	static _name = 'increment-repcount';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new IncrementRepcountInstruction(token);
	}

	execute(context) {
		const repcountPair = context.repcountStack[context.repcountStack.length - 1];
		repcountPair.current++;
		const isContinuingToRepeat = repcountPair.current <= repcountPair.max;
		context.valueStack.push(isContinuingToRepeat);
	}

	toDTO() {
		return {
			'name': IncrementRepcountInstruction._name
		};
	}
};