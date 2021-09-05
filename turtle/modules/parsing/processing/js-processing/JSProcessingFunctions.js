import { fetchJson } from
'../../../fetchJson.js';

const functionsData = await fetchJson('json/logo-migrations/processing/js-processing/functions.json');
const functionsMap = new Map();

for (const functionInfo of functionsData) {
	if (!functionsMap.has(functionInfo.name))
		functionsMap.set(functionInfo.name, []);

	functionsMap.get(functionInfo.name).push(functionInfo);
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

export class JSProcessingFunctions {
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