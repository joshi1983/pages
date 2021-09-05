import { StringBuffer } from
'../../../../../StringBuffer.js';
import { StringUtils } from
'../../../../../StringUtils.js';

export function scanTokensToCode(scanTokens) {
	const result = new StringBuffer();
	let resultLineCount = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const newCount = StringUtils.countChar(token.s, '\n');
		const goalLineCount = Math.max(0, token.lineIndex - 1 - resultLineCount - newCount);
		result.append('\n'.repeat(goalLineCount) + token.s);
		resultLineCount = token.lineIndex;
		if (token.s !== '\n' && i !== scanTokens.length - 1)
			result.append(' ');
	}
	return result.toString();
};