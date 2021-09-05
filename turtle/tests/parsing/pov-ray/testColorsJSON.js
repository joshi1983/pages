import { fetchJson } from '../../../modules/fetchJson.js';
import { testGeneralColorListJSONFormat } from '../../helpers/testGeneralColorListJSONFormat.js';
const colorData = await fetchJson('json/logo-migrations/pov-ray/colors.json');

export function testColorsJSON(logger) {
	testGeneralColorListJSONFormat(colorData, logger, true);
};