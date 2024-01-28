import { LogoInstruction } from './LogoInstruction.js';
import { MathCommands } from '../../../command-groups/MathCommands.js';
const mathCommands = new MathCommands();

const ops = {
	'*': function(valueStack, len) {
		return valueStack[len - 2] * valueStack[len - 1];
	},
	'+': function(valueStack, len) {
		return valueStack[len - 2] + valueStack[len - 1];
	},
	'-': function(valueStack, len) {
		return valueStack[len - 2] - valueStack[len - 1];
	},
	'/': function(valueStack, len) {
		return valueStack[len - 2] / valueStack[len - 1];
	},
	'=': function(valueStack, len) {
		return mathCommands.equalp(valueStack[len - 2], valueStack[len - 1]);
	},
	'<>': function(valueStack, len) {
		return mathCommands.notEqualp(valueStack[len - 2], valueStack[len - 1]);
	},
	'>': function(valueStack, len) {
		return valueStack[len - 2] > valueStack[len - 1];
	},
	'<': function(valueStack, len) {
		return valueStack[len - 2] < valueStack[len - 1];
	},
	'<=': function(valueStack, len) {
		return valueStack[len - 2] <= valueStack[len - 1];
	},
	'>=': function(valueStack, len) {
		return valueStack[len - 2] >= valueStack[len - 1];
	}
};

export class BinaryOperatorInstruction extends LogoInstruction {
	static _name = 'binary-operator';

	constructor(operatorSymbol, parseTreeToken) {
		super(false, parseTreeToken);
		this.opFunc = ops[operatorSymbol];
		this.operatorSymbol = operatorSymbol;
	}

	static evaluate(symbol, val1, val2) {
		return ops[symbol]([val1, val2], 2);
	}

	static createFromDTO(dto, token) {
		return new BinaryOperatorInstruction(dto.symbol, token);
	}

	execute(context) {
		const len = context.valueStack.length;
		context.valueStack[len - 2] = this.opFunc(context.valueStack, len);
		context.valueStack.length--; // like pop() but might be a little faster.
	}

	toDTO() {
		return {
			'name': BinaryOperatorInstruction._name,
			'symbol': this.operatorSymbol
		};
	}
};