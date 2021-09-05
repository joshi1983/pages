import { fetchJson } from
'../../../fetchJson.js';

const qbData = await fetchJson('json/logo-migrations/basic/micro-a/migrationToQBasic.json');
const data = await fetchJson('json/logo-migrations/basic/micro-a/migrationToWebLogo.json');
const functionMap = new Map();
const qbFunctionMap = new Map();
for (const info of data.functions) {
	functionMap.set(info.name.toLowerCase(), info);
}
for (const info of qbData.functions) {
	const lowerName = info.name.toLowerCase();
	qbFunctionMap.set(lowerName, info);
	if (!functionMap.has(lowerName))
		functionMap.set(lowerName, info);
}

export class MicroAInternalFunctions {
	static getFunctionInfo(name) {
		name = name.toLowerCase();
		return functionMap.get(name);
	}

	static getToQBFunctionInfo(name) {
		name = name.toLowerCase();
		return qbFunctionMap.get(name);
	}
};