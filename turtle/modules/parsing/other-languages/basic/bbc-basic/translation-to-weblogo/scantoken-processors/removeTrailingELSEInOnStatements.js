import { isREMComment } from
'../../../qbasic/scanning/isREMComment.js';

export function removeTrailingELSEInOnStatements(scanTokens) {
	let latestOnToken;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const next = scanTokens[i + 1];
		if (latestOnToken !== undefined &&
		token.lineIndex !== latestOnToken.lineIndex)
			latestOnToken = undefined;
		if (token.s.toLowerCase() === 'on')
			latestOnToken = token;
		else if (token.s.toLowerCase() === 'else' &&
		latestOnToken !== undefined &&
		(next === undefined || next.lineIndex !== token.lineIndex || isREMComment(next.s))) {
			// remove this ELSE token.
			scanTokens.splice(i, 1);
		}
	}
};