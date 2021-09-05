import { LogoInstruction } from './LogoInstruction.js';

export class JavaScriptFunctionCallInstruction extends LogoInstruction {
	static _name = 'call-js';

	constructor(func, numArgs, pushReturnValue, parseTreeToken) {
		if (typeof func !== 'function')
			throw new Error('func must be a function.  Passed is: ' + func);
		super(false, parseTreeToken);
		this.func = func;
		this.numArgs = numArgs;
		this.pushReturnValue = pushReturnValue;
	}

	/*
	Won't always work properly.
	Implementation here mainly for automated testing purposes.
	*/
	static createFromDTO(dto, token) {
		return new JavaScriptFunctionCallInstruction(new Function('context', dto.code), dto.numArgs, token);
	}

	execute(context) {
		const valueStack = context.valueStack;
		const len = valueStack.length;
		const args = valueStack.slice(len - this.numArgs, len);
		const result = this.func(...args);
		if (this.numArgs === 0) {
			if (this.pushReturnValue)
				valueStack.push(result);
		}
		else {
			if (this.pushReturnValue) {
				valueStack[len - this.numArgs] = result;
				valueStack.length -= this.numArgs - 1;
			}
			else {
				valueStack.length -= this.numArgs;
			}
		}
	}

/*
The returned code won't always be correct.
*/
	toDTO() {
		return {
			'name': JavaScriptFunctionCallInstruction._name,
			'code': '' + this.func,
			'numArgs': this.numArgs,
			'pushReturnValue': this.pushReturnValue
		};
	}

};