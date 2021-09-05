import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';
import { testProcedure } from './testProcedure.js';
import { validateOperatorsJSONData } from '../../helpers/parsing/validateOperatorsJSONData.js';
const operators = await fetchJson('json/logo-migrations/processing/operators.json');

export function testOperatorsJSON(logger) {
	validateOperatorsJSONData(operators, logger);
	for (const info of operators) {
		if (info.toProc !== undefined) {
			const url = `logo-scripts/processing-content/${info.toProc}.lgo`;
			fetchText(url).then(function(content) {
				testProcedure(info.toProc, content, logger);
			});
		}
	}
};