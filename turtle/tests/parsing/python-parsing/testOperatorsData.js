import { fetchJson } from '../../../modules/fetchJson.js';
import { validateOperatorsJSONData } from '../../helpers/parsing/validateOperatorsJSONData.js';

const operators = await fetchJson('json/logo-migrations/python/operators.json');

export function testOperatorsData(logger) {
	validateOperatorsJSONData(operators, logger);
};