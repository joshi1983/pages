import { LogoInstruction } from './LogoInstruction.js';
export class PushInstruction extends LogoInstruction {
	static _name = 'push';

	constructor(value, parseTreeToken, isCloningValue) {
		if (typeof isCloningValue !== 'boolean')
			throw new Error('isCloningValue must be either true or false.  Not: ' + isCloningValue);
		super(false, parseTreeToken);

		if (value === undefined)
			throw new Error('PushInstruction can push null but can not push undefined');

		this.isCloningValue = isCloningValue;
		this.value = value;
	}

	static createFromDTO(dto, token) {
		let val = dto.value;
		if (val instanceof Array)
			val = val.slice(); // clone to prevent issues like queue2 modifying it
		return new PushInstruction(val, token, dto.isCloningValue);
	}

	execute(context) {
		if (this.isCloningValue) {
			let val = this.value;
			if (val instanceof Array)
				val = val.slice(0);
			else if (val instanceof Map)
				val = new Map(val);
			context.valueStack.push(val);
		}
		else
			context.valueStack.push(this.value);
	}

	toDTO() {
		return {
			'name': PushInstruction._name,
			'value': this.value,
			'isCloningValue': this.isCloningValue
		};
	}
};