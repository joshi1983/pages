import { fetchJson } from '../../../fetchJson.js';
const reservedWords = await fetchJson('json/logo-migrations/processing/ReservedWords.json');
const reservedWordNames = new Set(reservedWords.map(w => w.name));

export function isReservedWord(s) {
	return reservedWordNames.has(s);
};