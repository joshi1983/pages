import { fetchJson } from '../../../fetchJson.js';
import { GenericOperators } from '../../generic-parsing-utilities/GenericOperators.js';

let result;

export async function getOperatorsAsync() {
	if (result === undefined) {
		const operators = await fetchJson('json/JavaScript/operators.json');
		result = new GenericOperators(operators, ['=>', '=']);
	}
	return result;
};

