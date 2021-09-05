import { fetchJson } from '../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
const operators = await fetchJson('json/css/operators.json');

export function testOperatorsJSON(logger) {
};