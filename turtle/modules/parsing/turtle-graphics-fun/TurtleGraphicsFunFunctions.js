import { fetchJson } from
'../../fetchJson.js';

const migrationData = await fetchJson('json/logo-migrations/turtle-graphics-fun/migration.json');
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

export class TurtleGraphicsFunFunctions {
	static getFunctionInfo(name, numArgs) {
		let matchedFunctionInfo = functionsMap.get(name);
		if (matchedFunctionInfo !== undefined) {
			return matchedFunctionInfo;
		}
	};
};