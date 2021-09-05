import { ArrayUtils } from
'../../../ArrayUtils.js';

function tryProcessingCompoundName(scanTokens, i, compoundNameMap) {
	const first = scanTokens[i].s.toLowerCase();
	if (compoundNameMap.has(first)) {
		for (const names of compoundNameMap.get(first)) {
			let matched = true;
			for (let j = 0; j < names.length; j++) {
				const token = scanTokens[i + 1 + j];
				if (token === undefined ||
				names[j] !== token.s.toLowerCase()) {
					matched = false;
					break;
				}
			}
			if (matched) {
				return removeRemainingTokensOnLine(scanTokens, i);
			}
		}
	}
	return false;
}

function removeRemainingTokensOnLine(scanTokens, i) {
	const token = scanTokens[i];
	for (i++; i < scanTokens.length; i++) {
		if (scanTokens[i].lineIndex !== token.lineIndex)
			break;
	}
	i--;
	return i;
}

export function processRemoveInMigration(scanTokens, migrationInfo) {
	const removeSet = new Set();
	const compoundNameMap = new Map();
	migrationInfo.functions.forEach(function(functionInfo) {
		if (functionInfo.removeInMigration === true) {
			const name = functionInfo.name.toLowerCase();
			const spaceIndex = name.indexOf(' ');
			if (spaceIndex === -1)
				removeSet.add(functionInfo.name);
			else {
				const first = name.substring(0, spaceIndex);
				if (!compoundNameMap.has(first))
					compoundNameMap.set(first, []);
				compoundNameMap.get(first).push(name.split(' ').slice(1));
			}
		}
	});
	const result = [];
	// loop through tokens.
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const s = token.s.toLowerCase();
		if (removeSet.has(s)) {
			i = removeRemainingTokensOnLine(scanTokens, i);
		}
		else {
			const j = tryProcessingCompoundName(scanTokens, i, compoundNameMap);
			if (j === false)
				result.push(token);
			else {
				i = j;
			}
		}
	}
	scanTokens.length = 0;
	ArrayUtils.pushAll(scanTokens, result);
};