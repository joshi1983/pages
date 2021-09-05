import { fetchJson } from
'../../../fetchJson.js';

const data = await fetchJson('json/logo-migrations/basic/pbasic/migrationToWebLogo.json');
const functionMap = new Map();
for (const info of data.functions) {
	functionMap.set(info.name.toLowerCase(), info);
}

export class PBasicInternalFunctions {
	static getFunctionInfo(name) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string but given ${name}`);

		name = name.toLowerCase();
		return functionMap.get(name);
	}
};