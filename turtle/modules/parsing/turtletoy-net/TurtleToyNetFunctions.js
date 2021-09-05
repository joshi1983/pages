import { fetchJson } from
'../../fetchJson.js';

const migrationData = await fetchJson('json/logo-migrations/turtletoy-net/migration.json');
const functionsMap = new Map();

for (const functionInfo of migrationData.commands) {
	if (!functionsMap.has(functionInfo.primaryName))
		functionsMap.set(functionInfo.primaryName, []);

	functionsMap.set(functionInfo.primaryName, functionInfo);
	if (functionInfo.names !== undefined)
		for (const name of functionInfo.names) {
			functionsMap.set(name, functionInfo);
		}
}

export class TurtleToyNetFunctions {
	static getFunctionInfo(name, className) {
		let matchedFunctionInfo = functionsMap.get(name);
		if (matchedFunctionInfo !== undefined) {
			if ((matchedFunctionInfo.className === undefined) !==
			(className === undefined))
				return;

			return matchedFunctionInfo;
		}
	};
};