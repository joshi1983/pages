function getCommentTokenCount(scanTokens, i) {
	const tok1 = scanTokens[i];
	if (tok1.s !== '#')
		return 0;

	let j;
	for (j = i + 1; j < scanTokens.length; j++) {
		const tok = scanTokens[j];
		if (tok.lineIndex !== tok1.lineIndex)
			break;
	}
	return j - i;
}

function convertComment(scanTokens, startIndex, len) {
	let s = 'REM ';
	const startToken = scanTokens[startIndex];
	const lastToken = scanTokens[startIndex + len - 1];
	let colIndex = scanTokens[startIndex].colIndex + 1;
	for (let i = 1; i < len; i++) {
		const tok = scanTokens[startIndex + i];
		s += ' '.repeat(Math.max(0, tok.colIndex - colIndex - tok.s.length));
		s += tok.s;
		colIndex = tok.colIndex;
	}
	startToken.s = s;
	startToken.colIndex = lastToken.colIndex;
	scanTokens.splice(startIndex + 1, len - 1); // remove the extra tokens.
}

// QBASIC does not support comments starting with # but Basic 256 does.
// This converts Basic 256's #-comments to REM comments.
export function convertHashSingleLineComments(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const len = getCommentTokenCount(scanTokens, i);
		if (len !== 0) {
			convertComment(scanTokens, i, len);
		}
	}
};