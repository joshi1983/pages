import { LogoInstruction } from './LogoInstruction.js';

export function executeIncrementForCounterInstructionNoPush(context) {
	const forcount = context.forcountStack[context.forcountStack.length - 1];
	forcount.current += forcount.step;
	const proc = context.getCurrentExecutingProcedure();
	if (proc)
		proc.localVariables.set(forcount.variableName, forcount.current);
	else
		context.globalVariables.set(forcount.variableName, forcount.current);
	return forcount.step !== 0 && ( forcount.current === forcount.stop || ((forcount.step > 0) === (forcount.current < forcount.stop)));
};

export class IncrementForCounterInstruction extends LogoInstruction {
	static _name = 'increment-for-counter';

	constructor(parseTreeToken) {
		super(false, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new IncrementForCounterInstruction(token);
	}

	execute(context) {
		let isContinuingToRepeat = executeIncrementForCounterInstructionNoPush(context);
		context.valueStack.push(isContinuingToRepeat);
	}

	toDTO() {
		return {
			'name': IncrementForCounterInstruction._name
		};
	}
};