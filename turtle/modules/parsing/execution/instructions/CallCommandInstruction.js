import { Command } from '../../Command.js';
import { getDataConverters } from './data-type-converters/getDataConverters.js';
import { getMethodNameForCommand } from '../../getMethodNameForCommand.js';
import { LogoInstruction } from './LogoInstruction.js';
await Command.asyncInit();

export class CallCommandInstruction extends LogoInstruction {
	static _name = 'call-cmd';

	constructor(command, numArgs, parseTreeToken, skipValidationAndSanitization) {
		super(false, parseTreeToken);
		if (typeof command !== 'object')
			throw new Error(`command must be an object but found ${command}`);
		if (typeof command.primaryName !== 'string')
			throw new Error('command must have a primaryName');
		if (!Number.isInteger(numArgs))
			throw new Error(`numArgs must be an integer.  Not: ${numArgs}`);
		if (skipValidationAndSanitization === undefined)
			skipValidationAndSanitization = false;
		if (typeof skipValidationAndSanitization !== 'boolean')
			throw new Error('skipValidationAndSanitization must be boolean or undefinfed.  Got: ' + skipValidationAndSanitization);

		this.command = command;
		this.commandGroup = command.commandGroup;
		if (this.commandGroup === 'compiled')
			this.commandGroup = undefined;

		this.methodName = getMethodNameForCommand(command.primaryName);
		this.numArgs = numArgs;
		this.converters = [];
		this.skipValidationAndSanitization = skipValidationAndSanitization;
		if (skipValidationAndSanitization === false) {
			this.converters = getDataConverters(command, numArgs, parseTreeToken);
		}
	}

	convertParameterTypes(vals, context) {
		if (this.skipValidationAndSanitization === true)
			return vals;
		const outer = this;
		return vals.map(function(val, index) {
			return outer.converters[index](val, context);
		});
	}

	static createFromDTO(dto, token) {
		return new CallCommandInstruction(Command.getCommandInfo(dto.commandName), dto.numArgs, token, dto.skipValidationAndSanitization);
	}

	execute(context) {
		const len = context.valueStack.length;
		const actualParameters = this.convertParameterTypes(context.valueStack.slice(len - this.numArgs, len), context);
		var returnValue;
		if (this.commandGroup !== undefined)
			returnValue = context[this.commandGroup][this.methodName](...actualParameters);
		else {
			returnValue = context[this.methodName](...actualParameters);
		}
		context.valueStack.length -= (actualParameters.length - 1); // pop all parameter values.
		context.valueStack[context.valueStack.length - 1] = returnValue;
	}

	toDTO() {
		return {
			'name': CallCommandInstruction._name,
			'commandName': this.command.primaryName,
			'numArgs': this.numArgs,
			'skipValidationAndSanitization': this.skipValidationAndSanitization
		};
	}
}