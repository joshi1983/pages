import { fetchJson } from '../../../fetchJson.js';
import { GenericOperators } from '../../generic-parsing-utilities/GenericOperators.js';
const migrationData = await fetchJson('json/JavaScript/webLogoToJavaScript.json');
const operators = migrationData.operators;

const Operators = new GenericOperators(operators);
export { Operators };