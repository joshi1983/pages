import { fetchJson } from '../../fetchJson.js';
const functionsArray = await fetchJson('json/pythonTurtle.json');
const functionsMap = new Map();
functionsArray.forEach(function(funcInfo, index) {
	funcInfo.names.forEach(function(name) {
		functionsMap.set(name, funcInfo);
	});
});

export class PythonFunctions {
	static getAllFunctions() {
		return functionsArray;
	}

	static getFunctionInfo(name) {
		return functionsMap.get(name);
	}
};