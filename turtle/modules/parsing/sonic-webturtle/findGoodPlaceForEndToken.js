import { isAfterOrSame } from '../generic-parsing-utilities/isAfterOrSame.js';
import { isInvalidProcStart } from './isInvalidProcStart.js';
import { Token } from '../generic-parsing-utilities/Token.js';

function getFirstReturn(scanTokens) {
	for (const token of scanTokens) {
		if (token.s.toLowerCase() === 'return')
			return token;
	}
}

export function findGoodPlaceForEndToken(scanTokens) {
	let lastToken = scanTokens[scanTokens.length - 1];
	if (lastToken === undefined) {
		return new Token('end', 1, 1);
	}
	else {
		lastToken = new Token('end', 0, lastToken.lineIndex + 1);
	}
	const possibleProcs = scanTokens.filter(tok => tok.s[0] === '#' && !isInvalidProcStart(tok.s));
	if (possibleProcs.length === 0) {
		return lastToken;
	}
	const firstReturn = getFirstReturn(scanTokens);
	if (firstReturn === undefined)
		return lastToken;
	else {
		for (let i = 0; i < possibleProcs.length; i++) {
			const proc = possibleProcs[i];
			if (isAfterOrSame(firstReturn, proc)) {
				const index = scanTokens.indexOf(proc);
				let prevToken;
				let lineIndex = proc.lineIndex - 1;
				let colIndex = 9999;
				if (index !== 0) {
					prevToken = scanTokens[index - 1];
					if (prevToken.lineIndex === proc.lineIndex) {
						lineIndex = proc.lineIndex;
						colIndex = prevToken.colIndex + 1;
					}
					else if (prevToken.lineIndex === proc.lineIndex - 1) {
						lineIndex = prevToken.lineIndex;
						colIndex = prevToken.colIndex + 1;
					}
					else {
						colIndex = 0;
					}
				}
				return new Token('end', colIndex, lineIndex);
			}
		}
		return lastToken;
	}
};