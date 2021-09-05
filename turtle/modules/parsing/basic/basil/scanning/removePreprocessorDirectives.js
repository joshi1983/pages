import { isComment } from '../../qbasic/scanning/isComment.js';

function getPreprocessorDirectiveLength(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s[0] !== '#')
		return 0;
	let j;
	for (j = i + 1; j < scanTokens.length; j++) {
		const tok = scanTokens[j];
		if (tok.lineIndex !== token.lineIndex || isComment(tok.s))
			break;
	}
	return j - i;
}

export function removePreprocessorDirectives(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const len = getPreprocessorDirectiveLength(scanTokens, i);
		if (len !== 0) {
			scanTokens.splice(i, len);
		}
	}
};