import { fetchJson } from '../../fetchJson.js';
import { GenericOperators } from '../generic-parsing-utilities/GenericOperators.js';
const operators = await fetchJson('json/JavaScript/operators.json');

const Operators = new GenericOperators(operators, ['=>', '=']);
export { Operators };