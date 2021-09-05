import { fetchJson } from '../../../fetchJson.js';
const migrationData = await fetchJson('json/logo-migrations/basic/qbasic/migration.json');

const keywordsMap = new Map();
for (const keywordInfo of migrationData.keywords) {
	keywordsMap.set(keywordInfo.from.toLowerCase(), keywordInfo);
}

export class QBasicKeywords {
	static isKeyword(s) {
		return keywordsMap.has(s.toLowerCase());
	}
};