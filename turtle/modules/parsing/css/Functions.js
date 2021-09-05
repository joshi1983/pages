import { fetchJson } from '../../fetchJson.js';
const funcs = await fetchJson('json/css/functions.json');
const functionsMap = new Map();
funcs.forEach(function(funcInfo) {
	functionsMap.set(funcInfo.primaryName, funcInfo);
});

export class Functions {
	static getFunctionInfo(name) {
		return functionsMap.get(name);
	}
};