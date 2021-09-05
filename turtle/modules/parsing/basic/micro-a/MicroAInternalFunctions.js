import { fetchJson } from
'../../../fetchJson.js';

const data = await fetchJson('json/logo-migrations/basic/micro-a/migrationToWebLogo.json');
const functionMap = new Map();
for (const info of data.functions) {
	functionMap.set(info.name.toLowerCase(), info);
}

export class MicroAInternalFunctions {
	static getFunctionInfo(name) {
		return functionMap.get(name);
	}
};