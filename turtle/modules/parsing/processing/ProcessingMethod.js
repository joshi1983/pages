import { fetchJson } from '../../fetchJson.js';
const methodsData = await fetchJson('json/logo-migrations/processing/methods.json');
const methodsMap = new Map();
function getKey(methodName, className) {
	return methodName + '-' + className;
}

function getSpecificity(methodInfo) {
	let result = 0;
	if (methodInfo.argCount !== undefined)
		result++;
	if (methodInfo.args !== undefined)
		result += 2;

	return result;
}

function addSpecificity(methodInfo) {
	methodInfo.specificity = getSpecificity(methodInfo);
}

methodsData.forEach(function(info) {
	addSpecificity(info);
	const key = getKey(info.name, info.className);
	const existing = methodsMap.get(key);
	if (existing === undefined)
		methodsMap.set(key, [info]);
	else {
		existing.push(info);
	}
});

function isMatchingArgTypes(argTypes) {
	return function(methodInfo) {
		if (methodInfo.args !== undefined) {
			if (argTypes.length !== methodInfo.args.length)
				return false;
			const args = methodInfo.args;
			for (let i = 0; i < args.length; i++) {
				if (argTypes[i] !== '*' && args[i].type !== argTypes[i])
					return false;
			}
		}
		return true;
	};
}

function isStrictlyMatchingArgTypes(argTypes) {
	return function(methodInfo) {
		if (methodInfo.args !== undefined) {
			if (argTypes.length !== methodInfo.args.length)
				return false;
			const args = methodInfo.args;
			for (let i = 0; i < args.length; i++) {
				if (args[i].type !== argTypes[i])
					return false;
			}
		}
		return true;
	};
}

function getMostSpecific(info) {
	const maxSpecificity = Math.max(...info.map(methodInfo => methodInfo.specificity));
	return info.filter(methodInfo => methodInfo.specificity === maxSpecificity);
}

export class ProcessingMethod {
	static getMethodInfo(name, className, argCount, argTypes) {
		let info = methodsMap.get(getKey(name, className));
		if (info === undefined)
			return;
		info = info.filter(i => i.argCount === undefined || i.argCount === argCount);
		if (argTypes !== undefined) {
			info = info.filter(isMatchingArgTypes(argTypes));
			if (info.length > 1) {
				info = info.filter(isStrictlyMatchingArgTypes(argTypes));
			}
		}
		if (info.length > 1) {
			info = getMostSpecific(info);
		}
		if (info.length === 1)
			return info[0];
	}
};