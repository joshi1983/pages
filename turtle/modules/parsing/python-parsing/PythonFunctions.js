import { fetchJson } from '../../fetchJson.js';
const functionsArray = await fetchJson('json/logo-migrations/python/pythonTurtle.json');
const functionsMap = new Map();
functionsArray.forEach(function(funcInfo, index) {
	funcInfo.names.forEach(function(name) {
		let funcsByNameInfo = functionsMap.get(name);
		if (funcsByNameInfo === undefined) {
			funcsByNameInfo = new Map();
			functionsMap.set(name, funcsByNameInfo);
		}
		funcsByNameInfo.set(funcInfo.className, funcInfo);
	});
});

export class PythonFunctions {
	static getAllFunctions() {
		return functionsArray;
	}

	static getFunctionInfo(name, className) {
		const funcsByNameInfo = functionsMap.get(name);
		if (funcsByNameInfo === undefined)
			return;
		if (className !== undefined) {
			return funcsByNameInfo.get(className);
		}
		const match = funcsByNameInfo.get(undefined);
		if (match !== undefined)
			return match;
		if (funcsByNameInfo.size === 1)
			return funcsByNameInfo.values().next().value;
	}
};