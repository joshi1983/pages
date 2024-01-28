import { executeIncrementForCounterInstructionNoPush } from './IncrementForCounterInstruction.js';
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
		const valueStack = context.valueStack;
		const step = valueStack.pop();
		const stop = valueStack.pop();
		const start = valueStack.pop();
		const variableName = valueStack.pop();
		context.forcountStack.push({'variableName': variableName, 'stop': stop, 'current': start - step, 'step': step});
		executeIncrementForCounterInstructionNoPush(context);
	}

	toDTO() {
		return {
			'name': PushForCountInstruction._name
		};
	}
};