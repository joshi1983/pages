import { isIdentifier } from
'../qbasic/scanning/isIdentifier.js';
import { isNumberLiteralStart } from
'../qbasic/scanning/isNumberLiteralStart.js';

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
		isNumberLiteralStart(token.s)) {
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