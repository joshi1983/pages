import { fetchJson } from
'../../../fetchJson.js';

const migrationData = await fetchJson('json/logo-migrations/turtle-graphics-fun/migration.json');
const functionsMap = new Map();

for (const functionInfo of migrationData) {
	if (!functionsMap.has(functionInfo.primaryName))
		functionsMap.set(functionInfo.primaryName, []);

	functionsMap.set(functionInfo.primaryName, functionInfo);
	if (functionInfo.names !== undefined)
		for (const name of functionInfo.names) {
			functionsMap.set(name, functionInfo);
		}
}

function isArgumentCountMatched(numArgs) {
	return function(functionInfo) {
		if (functionInfo.argCount !== undefined) {
			const argCount = functionInfo.argCount;
			return argCount.min <= numArgs &&
				argCount.max >= numArgs;
		}
		if (functionInfo.args !== undefined)
			return functionInfo.args.length === numArgs;

		return true;
	};
}

export class TurtleGraphicsFunFunctions {
	static getFunctionInfo(name, numArgs) {
		let matchedFunctions = functionsMap.get(name);
		if (matchedFunctions !== undefined) {
			if (Number.isInteger(numArgs)) {
				return matchedFunctions.filter(isArgumentCountMatched(numArgs));
			}
			return matchedFunctions;
		}
	};
};