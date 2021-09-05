import { StringBuffer } from
'../../../../../StringBuffer.js';
import { StringUtils } from
'../../../../../StringUtils.js';

function shouldAddSpaceAfter(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s === '\n' || i === scanTokens.length - 1)
		return false;
	const next = scanTokens[i + 1];
	if (token.s === '-' && token.lineIndex === next.lineIndex &&
	token.colIndex === next.colIndex - next.s.length)
		return false;

	return true;
}

export function scanTokensToCode(scanTokens) {
	const result = new StringBuffer();
	let resultLineCount = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const newCount = StringUtils.countChar(token.s, '\n');
		let goalLineCount = Math.max(0, token.lineIndex - 1 - resultLineCount - newCount);
		if (i > 0 && scanTokens[i - 1].s[0] === ';' && goalLineCount === 0)
			goalLineCount = 1;
		result.append('\n'.repeat(goalLineCount) + token.s);
		resultLineCount = token.lineIndex;
		if (shouldAddSpaceAfter(scanTokens, i))
			result.append(' ');
	}
	return result.toString();
};