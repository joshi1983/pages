import { fetchJson } from '../../fetchJson.js';
const migrationInfo = await fetchJson('json/logo-migrations/sonicWebTurtle.json');
const operatorsMap = new Map();
migrationInfo.operators.forEach(function(info) {
	operatorsMap.set(info.symbol, info);
});

export class SonicWebTurtleOperators {
	static getAllOperatorsData() {
		return migrationInfo.operators;
	}

	static getOperatorInfo(symbol) {
		return operatorsMap.get(symbol);
	};
};