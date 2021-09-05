import { fetchJson } from '../../fetchJson.js';
const methodsData = await fetchJson('json/logo-migrations/processing/methods.json');
const methodsMap = new Map();
function getKey(methodName, className) {
	return methodName + '-' + className;
}

methodsData.forEach(function(info) {
	const key = getKey(info.name, info.className);
	const existing = methodsMap.get(key);
	if (existing === undefined)
		methodsMap.set(key, [info]);
	else {
		existing.push(info);
	}
});

export class ProcessingMethod {
	static getMethodInfo(name, className, argCount) {
		let info = methodsMap.get(getKey(name, className));
		if (info === undefined)
			return;
		if (argCount !== undefined) {
			info = info.filter((i => i.argCount === undefined || i.argCount === argCount));
		}
		if (info.length === 1)
			return info[0];
	}
};