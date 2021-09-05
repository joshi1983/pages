import { genericProcessToFromMultipleSourceTokens } from
'./genericProcessToFromMultipleSourceTokens.js';
import { wrapParametersInCurvedBrackets } from './wrapParametersInCurvedBrackets.js';

export function genericProcessTo(migrationData) {
	const renameMap = new Map();
	const nameInfoMap = new Map();
	for (const f of migrationData.functions) {
		if (typeof f.name === 'string') {
			nameInfoMap.set(f.name.toLowerCase(), f);
			if (typeof f.name === 'string' && f.to !== undefined &&
			f.to.toLowerCase() !== f.name.toLowerCase())
				renameMap.set(f.name.toLowerCase(), f.to);
		}
		if (f.names instanceof Array) {
			for (const name of f.names) {
				nameInfoMap.set(name.toLowerCase(), f);
				if (f.to !== undefined &&
				f.to.toLowerCase() !== f.name.toLowerCase())
					renameMap.set(name.toLowerCase(), f.to);
			}
		}
	}
	const multipleSourceRename = genericProcessToFromMultipleSourceTokens(renameMap);
	return function(scanTokens) {
		for (let i = 0; i < scanTokens.length; i++) {
			const token = scanTokens[i];
			const lowerName = token.s.toLowerCase();
			const newName = renameMap.get(lowerName);
			if (newName) {
				token.s = newName;
			}
			const info = nameInfoMap.get(lowerName);
			if (info !== undefined &&
			info.wrapAllParametersWithCurvedBrackets === true) {
				wrapParametersInCurvedBrackets(scanTokens, i + 1, info);
			}
		}
		multipleSourceRename(scanTokens);
	};
};