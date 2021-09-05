import { isEscapedLineBreak } from '../isEscapedLineBreak.js';
import { PythonOperators } from '../../PythonOperators.js';

const spacedOperatorStarts = new Map();
for (const info of PythonOperators.getAll()) {
	const symbol = info.symbol;
	const index = symbol.indexOf(' ');
	if (index !== -1) {
		const first = symbol.substring(0, index);
		const remaining = symbol.split(' ').slice(1);
		let info = spacedOperatorStarts.get(first);
		if (info === undefined) {
			info = [];
		}
		info.push(remaining);
		spacedOperatorStarts.set(first, info);
	}
}

export function mergeSpacedOperators(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (spacedOperatorStarts.has(tok.s)) {
			const info = spacedOperatorStarts.get(tok.s);
			let j = 0;
			let matches = info;
			for (let offset = i + 1; matches.length !== 0 && offset < scanTokens.length; offset++) {
				const tok2 = scanTokens[offset];
				if (!isEscapedLineBreak(tok2.s)) {
					const newMatches = [];
					let finalMatchFound = false;
					for (const m of matches) {
						if (m[j] === tok2.s) {
							newMatches.push(m);
							if (j === m.length - 1) {
								finalMatchFound = true;
								break;
							}
						}
					}
					matches = newMatches;
					j++;
					if (finalMatchFound)
						break;
				}
			}
			const m = matches[0];
			if (matches.length === 1 && m.length === j) {
				tok.s = tok.s + ' ' + m.join(' ');
				let nextBreakLineIndex = i + 1;
				let numMatchTokensFound = 0;

				// Move any line break tokens adjacent.
				for (let j = i + 1; j < scanTokens.length; j++) {
					const tok2 = scanTokens[j];
					if (isEscapedLineBreak(tok2.s)) {
						scanTokens[nextBreakLineIndex] = scanTokens[j];
						nextBreakLineIndex++;
					}
					else {
						numMatchTokensFound++;
					}
				}
				// Remove the appropriate number of tokens.
				scanTokens.splice(nextBreakLineIndex, m.length);
			}
		}
	}
};