import { fetchJson } from '../../../modules/fetchJson.js';
import { testGeneralColorListJSONFormat } from '../../helpers/testGeneralColorListJSONFormat.js';
const data = await fetchJson('json/logo-migrations/sonic-webturtle/colors.json');

export function testColorsJSON(logger) {
	testGeneralColorListJSONFormat(data, logger, false);
};