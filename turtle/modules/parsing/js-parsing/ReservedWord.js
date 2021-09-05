import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/JavaScript/ReservedWords.json');

const reservedWords = data.map(info => info.name);
const reservedWordsSet = new Set(reservedWords);

export class ReservedWord {
	static getAllReservedWords() {
		return reservedWords;
	}
	
	static isReservedWord(name) {
		return reservedWordsSet.has(name);
	}
};