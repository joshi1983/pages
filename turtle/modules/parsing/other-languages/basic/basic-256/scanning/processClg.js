import { isComment } from './isComment.js';

export function processClg(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'clg') {
			const next = scanTokens[i + 1];
			if (next === undefined ||
			next.lineIndex !== token.lineIndex ||
			isComment(next.s))
				token.s = 'CLS';
		}
	}
};