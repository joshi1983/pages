import { isComment } from
'../../../qbasic/scanning/isComment.js';

export function removeLocalStatements(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'local') {
			let j;
			for (j = i + 1; j < scanTokens.length; j++) {
				const after = scanTokens[j];
				if (after.lineIndex !== token.lineIndex)
					break;
				if (isComment(after.s))
					break;
			}
			scanTokens.splice(i, j - i); // remove the local and subsequent tokens on the line.
		}
	}
};