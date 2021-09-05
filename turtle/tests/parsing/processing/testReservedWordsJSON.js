import { fetchJson } from '../../../modules/fetchJson.js';
import { validateReservedWordsJSONData } from '../../helpers/parsing/validateReservedWordsJSONData.js';
const reservedWords = await fetchJson('json/logo-migrations/processing/ReservedWords.json');

export function testReservedWordsJSON(logger) {
	validateReservedWordsJSONData(reservedWords, logger);
};