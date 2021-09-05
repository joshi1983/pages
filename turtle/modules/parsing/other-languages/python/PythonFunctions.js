import { ArrayUtils } from
'../../../ArrayUtils.js';
import { fetchJson } from '../../../fetchJson.js';
const functionsArray = await fetchJson('json/logo-migrations/python/pythonTurtle.json');
const packagesArray = await fetchJson('json/logo-migrations/python/packages.json');
const classNames = new Set();
const packagesMap = new Map();
const functionsMap = new Map();
packagesArray.forEach(function(packageInfo) {
	packageInfo.identifiers = [];
	packagesMap.set(packageInfo.name, packageInfo);
});
functionsArray.forEach(function(funcInfo, index) {
	const fClassNames = [];
	if (funcInfo.className !== undefined)
		fClassNames.push(funcInfo.className);
	else if (funcInfo.classNames instanceof Array &&
	funcInfo.classNames.length !== 0)
		ArrayUtils.pushAll(fClassNames, funcInfo.classNames);
	else
		fClassNames.push(undefined);

	funcInfo.names.forEach(function(name) {
		let funcsByNameInfo = functionsMap.get(name);
		if (funcsByNameInfo === undefined) {
			funcsByNameInfo = new Map();
			functionsMap.set(name, funcsByNameInfo);
		}
		for (const className of fClassNames) {
			if (typeof className === 'string')
				classNames.add(className);
			funcsByNameInfo.set(className, funcInfo);
			const packageInfo = packagesMap.get(className);
			if (packageInfo !== undefined) {
				packageInfo.identifiers.push(name);
			}
		}
	});
});
for (const name of functionsMap.keys()) {
	const vals = new Set();
	const classNameToInfoMap = functionsMap.get(name);
	if (classNameToInfoMap.has(undefined))
		continue;
	for (const value of classNameToInfoMap.values()) {
		vals.add(value);
	}
	if (vals.size === 1) {
		// if all the names link to the same information object, use it
		// when the className is undefined or unknown.
		classNameToInfoMap.set(undefined, vals.values().next().value);
	}
}

export class PythonFunctions {
	static getAllFunctions() {
		return functionsArray;
	}

	static getFunctionInfo(name, className) {
		const funcsByNameInfo = functionsMap.get(name);
		if (funcsByNameInfo === undefined)
			return;
		if (typeof className === 'string') {
			return funcsByNameInfo.get(className);
		}
		else if (className instanceof Array) {
			const matches = new Set();
			for (const className_ of className) {
				const match = funcsByNameInfo.get(className_);
				if (match !== undefined)
					matches.add(match);
			}
			if (matches.size === 1)
				return matches.values().next().value;
		}
		const match = funcsByNameInfo.get(undefined);
		if (match !== undefined)
			return match;
		if (funcsByNameInfo.size === 1)
			return funcsByNameInfo.values().next().value;
	}

	static getPackageInfo(packageName) {
		return packagesMap.get(packageName);
	}

	static isRecognizableClassName(className) {
		return classNames.has(className);
	}
};