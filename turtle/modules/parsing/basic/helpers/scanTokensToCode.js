import { isREMComment } from
'../qbasic/scanning/isREMComment.js';
import { StringBuffer } from
'../../../StringBuffer.js';
import { StringUtils } from
'../../../StringUtils.js';

/*
Similar to:
modules/components/code-editor/code-fixer/fixers/helpers/scanTokensToCode.js
but this one is for Basic languages and more specifically BBC Basic and AppleSoft Basic.
*/
export function scanTokensToCode(scanTokens) {
	const result = new StringBuffer();
	let resultLineCount = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const newCount = StringUtils.countChar(token.s, '\n');
		let goalLineCount = Math.max(0, token.lineIndex - resultLineCount - newCount);
		if (i > 0 && goalLineCount === 0 &&
		isREMComment(scanTokens[i - 1].s)
		) {
			goalLineCount = 1;
		}
		result.append('\n'.repeat(goalLineCount) + token.s);
		resultLineCount = token.lineIndex;
		result.append(' ');
	}
	return result.toString();
};