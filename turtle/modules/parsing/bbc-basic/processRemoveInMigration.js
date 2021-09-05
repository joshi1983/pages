import { ArrayUtils } from
'../../ArrayUtils.js';

export function processRemoveInMigration(scanTokens, migrationInfo) {
	const removeMap = new Map();
	migrationInfo.functions.forEach(function(functionInfo) {
		if (functionInfo.removeInMigration === true) {
			removeMap.set(functionInfo.name.toLowerCase(), functionInfo);
		}
	});
	const result = [];
	// loop through tokens.
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const s = token.s.toLowerCase();
		if (removeMap.has(s)) {
			for (i++; i < scanTokens.length; i++) {
				if (scanTokens[i].lineIndex !== token.lineIndex)
					break;
			}
			i--;
		}
		else {
			result.push(token);
		}
	}
	scanTokens.length = 0;
	ArrayUtils.pushAll(scanTokens, result);
};