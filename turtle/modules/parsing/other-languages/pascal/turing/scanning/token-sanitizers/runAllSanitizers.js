import { removeInvalidatingTokens } from
'./removeInvalidatingTokens.js';
import { sanitizeQuotes } from
'../../../../../basic/qbasic/scanning/token-sanitizers/sanitizeQuotes.js';
import { splitMinus } from
'./splitMinus.js';

const sanitizers = [
	removeInvalidatingTokens,
	sanitizeQuotes,
	splitMinus
];

export function runAllSanitizers(scanTokens) {
	let continueLooping = true;
	// The loop is limited to just a few iterations to mitigate the risk of an infinite loop.
	// An infinite loop shouldn't happen if the sanitizers are bug-free but mistakes and bugs happen.
	for (let i = 0; continueLooping && i < 3; i++) {
		for (const sanitizer of sanitizers) {
			const lenBefore = scanTokens.length;
			sanitizer(scanTokens);
			if (scanTokens.length !== lenBefore)
				continueLooping = true;
		}
	}
};