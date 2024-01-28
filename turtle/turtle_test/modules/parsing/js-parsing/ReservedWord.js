import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/JavaScript/ReservedWords.json');

export class ReservedWord {
	static getAllReservedWords() {
		return data.map(info => info.name);
	}
};