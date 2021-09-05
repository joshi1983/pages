import { fetchJson } from '../../../modules/fetchJson.js';
import { validateOperatorsJSONData } from '../../helpers/parsing/validateOperatorsJSONData.js';
const operators = await fetchJson('json/logo-migrations/pitrified-go-turtle/operators.json');

export function testOperatorsJSON(logger) {
	validateOperatorsJSONData(operators, logger, false);
};