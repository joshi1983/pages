import { fetchJson } from
'../../../../../../modules/fetchJson.js';
import { testGeneralColorListJSONFormat } from
'../../../../../helpers/testGeneralColorListJSONFormat.js';
const data = await fetchJson('json/logo-migrations/codeheart-turtlescript/colors.json');

export function testColorsJSON(logger) {
	testGeneralColorListJSONFormat(data, logger, true);
};