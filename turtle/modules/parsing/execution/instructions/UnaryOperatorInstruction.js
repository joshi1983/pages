import { LogoInstruction } from './LogoInstruction.js';

const ops = {
	'-': function(value) {
		return -value;
	}
};

export class UnaryOperatorInstruction extends LogoInstruction {
	static _name = 'unary-operator';

	constructor(operatorSymbol, parseTreeToken) {
		super(false, parseTreeToken);
		this.opFunc = ops[operatorSymbol];
		this.operatorSymbol = operatorSymbol;
	}

	static createFromDTO(dto, token) {
		return new UnaryOperatorInstruction(dto.symbol, token);
	}

	static evaluate(symbol, val) {
		return ops[symbol](val);
	}

	execute(context) {
		const index = context.valueStack.length - 1;
		context.valueStack[index] = this.opFunc(context.valueStack[index]);
	}

	toDTO() {
		return {
			'name': UnaryOperatorInstruction._name,
			'symbol': this.operatorSymbol
		};
	}
};