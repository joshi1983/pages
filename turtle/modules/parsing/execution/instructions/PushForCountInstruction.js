import { IncrementForCounterInstruction } from './IncrementForCounterInstruction.js';
import { LogoInstruction } from './LogoInstruction.js';

export class PushForCountInstruction extends LogoInstruction {
	static _name = 'push-for-count';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new PushForCountInstruction(token);
	}

	execute(context) {
		const step = context.valueStack.pop();
		const stop = context.valueStack.pop();
		const start = context.valueStack.pop();
		const variableName = context.valueStack.pop();
		context.forcountStack.push({'variableName': variableName, 'stop': stop, 'current': start - step, 'step': step});
		IncrementForCounterInstruction.executeIncrementForCounterInstruction(context);
	}

	toDTO() {
		return {
			'name': PushForCountInstruction._name
		};
	}
};