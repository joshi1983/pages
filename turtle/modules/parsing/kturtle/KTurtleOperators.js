import { fetchJson } from '../../fetchJson.js';
const migration = await fetchJson('json/logo-migrations/KTurtle.json');
const map = new Map();
migration.operators.forEach(function(operatorInfo) {
	map.set(operatorInfo.symbol, operatorInfo);
});

export class KTurtleOperators {
	static compareOperatorPrecedence(op1, op2) {
		op1 = KTurtleOperators.getOperatorInfo(op1);
		op2 = KTurtleOperators.getOperatorInfo(op2);
		return op1.precedence - op2.precedence;
	}

	static getOperatorInfo(symbol) {
		return map.get(symbol);
	}
};