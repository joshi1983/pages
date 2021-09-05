import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/JavaScript/ReservedWords.json');

const reservedWords = data.map(info => info.name);

export class ReservedWord {
	static getAllReservedWords() {
		return reservedWords;
	}
};