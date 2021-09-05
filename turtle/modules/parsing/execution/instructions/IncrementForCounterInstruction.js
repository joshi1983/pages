import { LogoInstruction } from './LogoInstruction.js';
export class IncrementForCounterInstruction extends LogoInstruction {
	static _name = 'increment-for-counter';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new IncrementForCounterInstruction(token);
	}

	execute(context) {
		IncrementForCounterInstruction.executeIncrementForCounterInstruction(context);
	}

	static executeIncrementForCounterInstruction(context) {
		const forcount = context.forcountStack[context.forcountStack.length - 1];
		forcount.current += forcount.step;
		const proc = context.getCurrentExecutingProcedure();
		if (proc)
			proc.localVariables.set(forcount.variableName, forcount.current);
		else
			context.globalVariables.set(forcount.variableName, forcount.current);
		let isContinuingToRepeat = forcount.step !== 0 && ( forcount.current === forcount.stop || ((forcount.step > 0) === (forcount.current < forcount.stop)));
		context.valueStack.push(isContinuingToRepeat);
	}

	toDTO() {
		return {
			'name': IncrementForCounterInstruction._name
		};
	}
};