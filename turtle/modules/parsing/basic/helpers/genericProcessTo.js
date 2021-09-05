import { genericProcessToFromMultipleSourceTokens } from
'./genericProcessToFromMultipleSourceTokens.js';
import { getArgCountFromScanTokens } from './getArgCountFromScanTokens.js';
import { wrapParametersInCurvedBrackets } from './wrapParametersInCurvedBrackets.js';

function isCompatibleWithArgCount(argCount) {
	return function(funcInfo) {
		if (funcInfo.argCount !== undefined) {
			const argCountInfo = funcInfo.argCount;
			if (Number.isInteger(argCountInfo.min) && argCountInfo.min > argCount)
				return false;
			if (Number.isInteger(argCountInfo.max) && argCountInfo.max < argCount)
				return false;
			return true;
		}
		if (funcInfo.args !== undefined)
			return funcInfo.args.length === argCount;

		return true;
	};
}

function getBestMatch(scanTokens, i, candidates) {
	const argCount = getArgCountFromScanTokens(scanTokens, i);
	if (argCount !== undefined) {
		let matchesForArgCount = candidates.filter(isCompatibleWithArgCount(argCount));
		if (matchesForArgCount.length === 1)
			return matchesForArgCount[0];
	}
	if (candidates.length === 1)
		return candidates[0];
}

function addToMapArray(nameToMatchesMap, name, f) {
	name = name.toLowerCase();
	if (!nameToMatchesMap.has(name))
		nameToMatchesMap.set(name, []);

	const matches = nameToMatchesMap.get(name);
	matches.push(f);
}

function getSimpleRenameMap(nameToMatchesMap) {
	const result = new Map();
	for (const [key, val] of nameToMatchesMap) {
		if (val.length === 1)
			result.set(key, val[0].name.toLowerCase());
	}
	
	return result;
}

export function genericProcessTo(migrationData) {
	const nameInfoMap = new Map();
	const nameToMatchesMap = new Map();
	for (const f of migrationData.functions) {
		if (typeof f.name === 'string') {
			nameInfoMap.set(f.name.toLowerCase(), f);
			if (typeof f.name === 'string' && f.to !== undefined &&
			f.to.toLowerCase() !== f.name.toLowerCase()) {
				addToMapArray(nameToMatchesMap, f.name, f);
			}
		}
		if (f.names instanceof Array) {
			for (const name of f.names) {
				nameInfoMap.set(name.toLowerCase(), f);
				if (f.to !== undefined &&
				f.to.toLowerCase() !== f.name.toLowerCase()) {
					addToMapArray(nameToMatchesMap, name, f);
				}
			}
		}
	}
	const multipleSourceRename = genericProcessToFromMultipleSourceTokens(getSimpleRenameMap(nameToMatchesMap));
	return function(scanTokens) {
		for (let i = 0; i < scanTokens.length; i++) {
			const token = scanTokens[i];
			const lowerName = token.s.toLowerCase();
			const candidates = nameToMatchesMap.get(lowerName);
			let info;
			if (candidates !== undefined) {
				info = getBestMatch(scanTokens, i, candidates);
				if (info !== undefined) {
					token.s = info.to;
					if (info.wrapAllParametersWithCurvedBrackets === true) {
						wrapParametersInCurvedBrackets(scanTokens, i + 1, info);
					}
				}
			}
		}
		multipleSourceRename(scanTokens);
	};
};