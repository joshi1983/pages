import { fetchJson } from '../fetchJson.js';
let operators;
let symbolsMap;
async function asyncInit() {
	operators = await fetchJson('json/operators.json');
	symbolsMap = new Map();
	operators.forEach(function(operatorInfo) {
		symbolsMap.set(operatorInfo.symbol, operatorInfo);
	});
}
const operatorsPromise = asyncInit();

export class Operators {
	static asyncInit() {
		return operatorsPromise;
	}

	static compareOperatorPrecedence(op1, op2) {
		op1 = Operators.getOperatorInfo(op1);
		op2 = Operators.getOperatorInfo(op2);
		return op1.precedence - op2.precedence;
	}

	static canBeBinary(operatorInfo) {
		return true;
	}

	static canBeUnary(operatorInfo) {
		if (typeof operatorInfo === 'string')
			operatorInfo = Operators.getOperatorInfo(operatorInfo);
		if (typeof operatorInfo !== 'object')
			throw new Error('operatorInfo must be an object or the string for an operator symbol.  Not: ' + operatorInfo);
		return operatorInfo.unary !== undefined;
	}

	static getOperatorInfo(symbol) {
		if (typeof symbol !== 'string')
			throw new Error('symbol must be a string but was given ' + symbol);
		return symbolsMap.get(symbol);
	}

	static getParameterTypes(operatorInfo, parameterIndex) {
		if (typeof operatorInfo === 'string')
			operatorInfo = Operators.getOperatorInfo(operatorInfo);
		return operatorInfo.args[parameterIndex];
	}

	static getBinaryReturnTypes(operatorInfo) {
		return operatorInfo.returnTypes;
	}

	static getUnaryReturnTypes(operatorInfo) {
		if (typeof operatorInfo === 'string')
			operatorInfo = Operators.getOperatorInfo(operatorInfo);
		return operatorInfo.unary.returnTypes;
	}

	static getUnaryParameterTypes(operatorInfo) {
		if (typeof operatorInfo === 'string')
			operatorInfo = Operators.getOperatorInfo(operatorInfo);
		return operatorInfo.unary.arg;
	}
};