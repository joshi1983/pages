import { Command } from '../../Command.js';
import { LogoInstruction } from './LogoInstruction.js';
await Command.asyncInit();

export class AsyncCallCommandInstruction extends LogoInstruction {
	static _name = 'async-call-cmd';

	constructor(command, numArgs, parseTreeToken) {
		super(false, parseTreeToken);
		this.command = command;
		this.commandGroup = command.commandGroup;
		this.methodName = Command.getMethodNameFor(command);
		this.numArgs = numArgs;
		this.isAsync = true;
	}

	static createFromDTO(dto, token) {
		return new AsyncCallCommandInstruction(Command.getCommandInfo(dto.commandName), dto.numArgs, token);
	}

	async execute(context) {
		const len = context.valueStack.length;
		const actualParameters = context.valueStack.slice(len - this.numArgs, len);
		const returnValue = await context[this.commandGroup][this.methodName](...actualParameters);
		context.valueStack.length -= (actualParameters.length - 1); // pop all parameter values.
		context.valueStack[context.valueStack.length - 1] = returnValue;
	}

	toDTO() {
		return {
			'name': AsyncCallCommandInstruction._name,
			'commandName': this.command.primaryName,
			'numArgs': this.numArgs
		};
	}
};