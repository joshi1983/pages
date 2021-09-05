import { fetchJson } from '../../fetchJson.js';
import { isAfterOrSame } from '../generic-parsing-utilities/isAfterOrSame.js';
const operators = await fetchJson('json/JavaScript/operators.json');
const operatorsMap = new Map();
operators.forEach(function(opInfo) {
	operatorsMap.set(opInfo.symbol, opInfo);
});
const specialSymbols = new Set(['=>', '=']);
export class Operators {
	static compareOperatorPrecedence(op1, op2, token1, token2) {
		if (specialSymbols.has(op1) && specialSymbols.has(op2)) {
			if (isAfterOrSame(token1, token2))
				return 1;
			else
				return -1;
		}
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