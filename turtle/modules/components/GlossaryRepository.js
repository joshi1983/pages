import { fetchJson } from '../fetchJson.js';
const data = await fetchJson('json/glossary.json');
const termsMap = new Map();
data.forEach(function(info) {
	termsMap.set(info.name.toLowerCase(), info);
});
export class GlossaryRepository {
	static getAllTermsData() {
		return data;
	}

	static getInfoByName(name) {
		name = name.toLowerCase();
		return termsMap.get(name);
	}
};