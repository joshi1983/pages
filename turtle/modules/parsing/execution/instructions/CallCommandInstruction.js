import { argInfoToCheckFunction, needsArgInfoCheck } from '../../compiling/instruction-list-optimization/instructions-to-JavaScript/argInfoToCheckFunction.js';
import { Colour } from '../../../Colour.js';
import { Command } from '../../Command.js';
import { convertToAlphaColour } from './data-type-converters/convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from './data-type-converters/convertToAlphaColourOrTransparent.js';
import { convertToColour } from './data-type-converters/convertToColour.js';
import { convertToColourOrTransparent } from './data-type-converters/convertToColourOrTransparent.js';
import { convertToStepPosition } from './data-type-converters/convertToStepPosition.js';
import { JavaScriptInstruction } from './JavaScriptInstruction.js';
import { LineCap } from '../../../drawing/vector/shapes/style/LineCap.js';
import { LogoInstruction } from './LogoInstruction.js';
import { LogoRuntimeException } from '../LogoRuntimeException.js';
import { validateList } from './data-type-converters/validateList.js';
import { validateListOrString } from './data-type-converters/validateListOrString.js';
import { validateNumber } from './data-type-converters/validateNumber.js';
import { validateString } from './data-type-converters/validateString.js';
import { validateVariableReference } from './data-type-converters/validateVariableReference.js';
await Command.asyncInit();

function noop(val) {
	return val;
}

const Sanitizers = {
	'lineCap': LineCap.parse,
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
				let wrapperFunc = noop;
				if (i < this.command.args.length) {
					const argInfo = this.command.args[i];
					if (argInfo.sanitization === 'convertToStepPosition')
						wrapperFunc = convertToStepPosition;
					else if (typeof argInfo.sanitization === 'string')
						wrapperFunc = Sanitizers[this.command.args[i].sanitization];
					else if (argInfo.types === 'alphacolor')
						wrapperFunc = convertToAlphaColour;
					else if (argInfo.types === 'alphacolor|transparent')
						wrapperFunc = convertToAlphaColourOrTransparent;
					else if (argInfo.types === 'color')
						wrapperFunc = convertToColour;
					else if (argInfo.types === 'color|transparent')
						wrapperFunc = convertToColourOrTransparent;
					else if (argInfo.types === 'list')
						wrapperFunc = validateList;
					else if (argInfo.types === 'list|string') {
						wrapperFunc = validateListOrString;
					}
					else if (argInfo.types === 'num')
						wrapperFunc = validateNumber;
					else if (argInfo.types === 'string') {
						if (argInfo.refTypes === undefined)
							wrapperFunc = validateString;
						else
							wrapperFunc = validateVariableReference(this.command.args[i].refTypes);
					}
					if (needsArgInfoCheck(argInfo) === true) {
						const name = `Parameter ${argInfo.name} in command ${command.primaryName}`;
						const errorCaseCheckFunc = argInfoToCheckFunction(argInfo, name, parseTreeToken);
						if (wrapperFunc === noop)
							wrapperFunc = errorCaseCheckFunc;
						else {
							const originalWrapperFunc = wrapperFunc;
							wrapperFunc = function(val) {
								return errorCaseCheckFunc(originalWrapperFunc(val));
							};
						}
					}
				}
				this.converters.push(wrapperFunc);
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