import { fetchJson } from '../../fetchJson.js';
const operatorsArray = (await fetchJson('json/logo-migrations/PovRay.json')).operators;
const operatorsMap = new Map();
for (const opInfo of operatorsArray) {
	operatorsMap.set(opInfo.symbol, opInfo);
}

export class PovRayOperators {
	static getOperatorInfo(symbol) {
		return operatorsMap.get(symbol);
	}
};