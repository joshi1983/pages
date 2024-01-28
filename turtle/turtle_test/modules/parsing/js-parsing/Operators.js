import { fetchJson } from '../../fetchJson.js';
const operators = await fetchJson('json/JavaScript/operators.json');
const operatorsMap = new Map();
operators.forEach(function(opInfo) {
	operatorsMap.set(opInfo.symbol, opInfo);
});
export class Operators {
	static compareOperatorPrecedence(op1, op2) {
		op1 = Operators.getOperatorInfo(op1);
		op2 = Operators.getOperatorInfo(op2);
		return op1.precedence - op2.precedence;
	}

	static getAll() {
		return operators;
	}

	static getOperatorInfo(symbol) {
		return operatorsMap.get(symbol);
	}
};