import { LogoInstruction } from './LogoInstruction.js';
export class VariableReadInstruction extends LogoInstruction {
	static _name = "read-variable";

	constructor(variableName, parseTreeToken) {
		super(false, parseTreeToken);
		this.variableName = variableName.toLowerCase();
	}

	static createFromDTO(dto, token) {
		return new VariableReadInstruction(dto.variableName, token);
	}

	execute(context) {
		context.valueStack.push(context.readVariable(this.variableName));
	}

	toDTO() {
		return {
			"name": VariableReadInstruction._name,
			"variableName": this.variableName
		};
	}
};