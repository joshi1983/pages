import { isCompleteIndent } from '../isCompleteIndent.js';

export function removeUnusedIndents(scanTokens) {
	const result = [];
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (tok.s.trim() === '') {
			if (isCompleteIndent(tok.s)) {
				const last = result[result.length - 1];
				if (last === undefined || (last.lineIndex === tok.lineIndex &&
				isCompleteIndent(last.s))) {
					result.push(tok);
				}
			}
		}
		else
			result.push(tok);
	}
	for (let i = 0; i < result.length; i++) {
		scanTokens[i] = result[i];
	}
	scanTokens.length = result.length;
};