import { Command } from '../../Command.js';
import { getDataConverters } from './data-type-converters/getDataConverters.js';
import { getMethodNameForCommand } from '../../getMethodNameForCommand.js';
import { LogoInstruction } from './LogoInstruction.js';
await Command.asyncInit();

export class AsyncCallCommandInstruction extends LogoInstruction {
	static _name = 'async-call-cmd';

	constructor(command, numArgs, parseTreeToken) {
		super(false, parseTreeToken);
		this.command = command;
		this.commandGroup = command.commandGroup;
		this.methodName = getMethodNameForCommand(command.primaryName);
		this.numArgs = numArgs;
		this.isAsync = true;
		this.converters = getDataConverters(command, numArgs, parseTreeToken);
	}

	convertParameterTypes(vals, context) {
		const outer = this;
		return vals.map(function(val, index) {
			return outer.converters[index](val, context);
		});
	}

	static createFromDTO(dto, token) {
		return new AsyncCallCommandInstruction(Command.getCommandInfo(dto.commandName), dto.numArgs, token);
	}

	async execute(context) {
		const len = context.valueStack.length;
		const actualParameters = this.convertParameterTypes(context.valueStack.slice(len - this.numArgs, len), context);
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