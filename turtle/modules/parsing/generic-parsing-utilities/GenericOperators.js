import { isAfterOrSame } from './isAfterOrSame.js';

export class GenericOperators {
	constructor(operatorsData, specialSymbols) {
		if (specialSymbols instanceof Array)
			specialSymbols = new Set(specialSymbols);
		else if (specialSymbols === undefined)
			specialSymbols = new Set();
		else if (!(specialSymbols instanceof Set))
			throw new Error('specialSymbols must be an Array, a Set, or undefined but got ' + specialSymbols);
		if (!(operatorsData instanceof Array))
			throw new Error(`operatorsData must be an Array but got ${operatorsData}`);
		const operatorsMap = new Map();
		operatorsData.forEach(function(opInfo) {
			operatorsMap.set(opInfo.symbol, opInfo);
		});
		this.operatorsMap = operatorsMap;
		this.operators = operatorsData;
		this.specialSymbols = specialSymbols;
		const outer = this;
		this.compareOperatorPrecedence = function(op1, op2, token1, token2) {
			if (specialSymbols.has(op1) && specialSymbols.has(op2)) {
				if (isAfterOrSame(token1, token2))
					return 1;
				else
					return -1;
			}
			op1 = outer.getOperatorInfo(op1);
			op2 = outer.getOperatorInfo(op2);
			return op1.precedence - op2.precedence;
		};
	}

	getAll() {
		return this.operators;
	}

	getOperatorInfo(symbol) {
		return this.operatorsMap.get(symbol);
	}

	createReplacementsMap() {
		const result = new Map();
		for (const info of this.operators) {
			if (info.to !== undefined)
				result.set(info.symbol, info.to);
		}
		return result;
	}
};