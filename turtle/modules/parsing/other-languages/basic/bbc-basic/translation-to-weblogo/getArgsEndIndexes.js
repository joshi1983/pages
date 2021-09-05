import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { isCompleteNumberLiteral } from
'../../qbasic/scanning/isCompleteNumberLiteral.js';

export function getArgsEndIndexes(scanTokens, index, paramCounts) {
	const startLineIndex = scanTokens[index - 1].lineIndex;
	let paramCountIndex = 0;
	const results = [];
	let count = 0;
	for (;index < scanTokens.length; index++) {
		const token = scanTokens[index];
		if (token.lineIndex !== startLineIndex) {
			if (count === paramCounts[paramCounts.length - 1])
				break;
			return;
		}
		if (isIdentifier(token.s) ||
		isCompleteNumberLiteral(token.s)) {
			count++;
			if (count === paramCounts[paramCountIndex]) {
				results.push(index);
				paramCountIndex++;
			}
		}
		else if (token.s.length === 1 &&
		'()[]-+*^/\\'.indexOf(token.s) !== -1)
			return;

	}
	if (results.length === paramCounts.length &&
	count === paramCounts[paramCounts.length - 1])
		return results;
}