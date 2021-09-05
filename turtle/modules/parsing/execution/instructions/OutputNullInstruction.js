import { LogoInstruction } from './LogoInstruction.js';
import { OutputInstruction } from './OutputInstruction.js';

export class OutputNullInstruction extends LogoInstruction {
	static _name = 'output-null';

	constructor(parseTreeToken) {
		super(true, parseTreeToken);
	}

	static createFromDTO(dto, token) {
		return new OutputNullInstruction(token);
	}

	execute(context) {
		OutputInstruction.executeWithOutputValue(context, null);
	}

	toDTO() {
		return {
			'name': OutputNullInstruction._name
		};
	}

};