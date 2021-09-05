import { LogoInstruction } from './LogoInstruction.js';

export class PushFromStackInstruction extends LogoInstruction {
	static _name = 'push-from-stack';

	constructor(numToPush, token) {
		if (!Number.isInteger(numToPush))
			throw new Error('numToPush must be an integer');
		super(false, token);
		this.numToPush = numToPush;
	}

	static createFromDTO(dto, token) {
		return new PushFromStackInstruction(dto.numToPush, token);
	}

	execute(context) {
		let pushBaseIndex = context.valueStack.length - this.numToPush;
		for (let i = this.numToPush - 1; i >= 0; i--) {
			context.valueStack.push(context.valueStack[pushBaseIndex + i]);
		}
	}

	toDTO() {
		return {
			'name': PushFromStackInstruction._name,
			'numToPush': this.numToPush
		};
	}
};