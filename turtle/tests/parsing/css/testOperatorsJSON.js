import { fetchJson } from '../../../modules/fetchJson.js';
const operators = await fetchJson('json/css/operators.json');

export function testOperatorsJSON(logger) {
	if (!(operators instanceof Array))
		logger(`Expected operators.json to contain an Array but got ${operators}`);
};