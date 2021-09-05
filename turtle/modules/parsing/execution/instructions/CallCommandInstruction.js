import { Colour } from '../../../Colour.js';
import { Command } from '../../Command.js';
import { JavaScriptInstruction } from './JavaScriptInstruction.js';
import { LogoInstruction } from './LogoInstruction.js';
import { LogoRuntimeException } from '../LogoRuntimeException.js';
import { Transparent } from '../../../Transparent.js';

function noop(val) {
	return val;
}

function validateList(val) {
	if (!(val instanceof Array))
		throw new LogoRuntimeException('List required.  Value given is ' + val);
	return val;
}

function validateListOrString(val) {
	if (val instanceof Array || typeof val === 'string')
		return val;
	else
		throw new LogoRuntimeException('List or string required.  Value given is ' + val);
}

function validateNumber(val) {
	if (typeof val !== 'number' || isNaN(val))
		throw new LogoRuntimeException('Number required.  Value given is ' + val);
	return val;
}

function validateString(val) {
	if (typeof val !== 'string')
		throw new LogoRuntimeException('String required.  Value given is ' + val);
	return val;
}

function validateVariableReference(refTypes) {
	if (refTypes === 'plist') {
		return function(varName, context) {
			const result = context.readVariable(varName);
			if (!(result instanceof Map))
				throw new LogoRuntimeException(`${varName} must be a plist but it is not`);
			return result;
		};
	}
	else if (refTypes === 'list') {
		return function(varName, context) {
			const result = context.readVariable(varName);
			if (!(result instanceof Array))
				throw new LogoRuntimeException(`${varName} must be a list but it is not`);
			return result;
		};
	}
}

function convertColourOrTransparent(val) {
	if (val === Transparent || val instanceof Colour)
		return val;
	if (typeof val === 'string' && val.toLowerCase() === 'transparent')
		return Transparent;
	return new Colour(val);
}

function convertColour(val) {
	if (val instanceof Colour)
		return val;
	return new Colour(val);
}

const Sanitizers = {
	'listToString': function(val) {
		if (val instanceof Array)
			return JavaScriptInstruction.convertListToString(val);
		else if (typeof val === 'string')
			return val;
		else
			throw new LogoRuntimeException(`value must either be a list or a string but is neither`);
	}
};

export class CallCommandInstruction extends LogoInstruction {
	static _name = 'call-cmd';

	constructor(command, numArgs, parseTreeToken, skipValidationAndSanitization) {
		super(false, parseTreeToken);
		if (typeof command !== 'object')
			throw new Error('command must be an object');
		if (typeof command.primaryName !== 'string')
			throw new Error('command must have a primaryName');
		if (typeof numArgs !== 'number' || isNaN(numArgs))
			throw new Error('numArgs must be a number');
		if (skipValidationAndSanitization === undefined)
			skipValidationAndSanitization = false;
		if (typeof skipValidationAndSanitization !== 'boolean')
			throw new Error('skipValidationAndSanitization must be boolean or undefinfed.  Got: ' + skipValidationAndSanitization);

		this.command = command;
		this.commandGroup = command.commandGroup;
		if (this.commandGroup === 'compiled')
			this.commandGroup = undefined;

		this.methodName = Command.getMethodNameFor(command);
		this.numArgs = numArgs;
		this.converters = [];
		this.skipValidationAndSanitization = skipValidationAndSanitization;
		if (skipValidationAndSanitization === false) {
			for (let i = 0; i < this.numArgs; i++) {
				if (i < this.command.args.length) {
					if (typeof this.command.args[i].sanitization === 'string')
						this.converters.push(Sanitizers[this.command.args[i].sanitization]);
					else if (this.command.args[i].types === 'color')
						this.converters.push(convertColour);
					else if (this.command.args[i].types === 'color|transparent')
						this.converters.push(convertColourOrTransparent);
					else if (this.command.args[i].types === 'list')
						this.converters.push(validateList);
					else if (this.command.args[i].types === 'list|string') {
						this.converters.push(validateListOrString);
					}
					else if (this.command.args[i].types === 'num')
						this.converters.push(validateNumber);
					else if (this.command.args[i].types === 'string') {
						if (this.command.args[i].refTypes === undefined)
							this.converters.push(validateString);
						else
							this.converters.push(validateVariableReference(this.command.args[i].refTypes));
					}
					else
						this.converters.push(noop);
				}
				else
					this.converters.push(noop);
			}
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