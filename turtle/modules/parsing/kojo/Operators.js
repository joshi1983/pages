import { fetchJson } from '../../fetchJson.js';
import { GenericOperators } from '../generic-parsing-utilities/GenericOperators.js';
const operators = await fetchJson('json/logo-migrations/kojo/operators.json');

const Operators = new GenericOperators(operators, []);
export { Operators };