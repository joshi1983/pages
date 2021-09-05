import { fetchJson } from '../../fetchJson.js';
import { GenericOperators } from '../generic-parsing-utilities/GenericOperators.js';

const operators = await fetchJson('json/logo-migrations/python/operators.json');

const PythonOperators = new GenericOperators(operators);

export { PythonOperators };