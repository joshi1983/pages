import { fetchJson } from '../../../../fetchJson.js';
import { GenericOperators } from '../../../generic-parsing-utilities/GenericOperators.js';
const migrationInfo = await fetchJson('json/logo-migrations/pascal/turing.json');

const Operators = new GenericOperators(migrationInfo.operators, []);
export { Operators };