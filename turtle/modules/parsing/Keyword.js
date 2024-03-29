import { fetchJson } from '../fetchJson.js';
const keywords = await fetchJson('json/keywords.json');
const keywordsMap = new Map();
keywords.forEach(function(keywordInfo) {
	keywordsMap.set(keywordInfo.name.toLowerCase(), keywordInfo);
});

export class Keyword {
	static getAllKeywords() {
		return keywordsMap.keys();
	}

	static getKeywordInfo(name) {
		name = name.trim().toLowerCase();
		if (keywordsMap.has(name))
			return keywordsMap.get(name);
	}
};