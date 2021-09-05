import { LogoScanner } from '../../parsing/LogoScanner.js';
import { naiveStripComments } from '../../parsing/naiveStripComments.js';
import { StringBuffer } from '../../StringBuffer.js';

function shouldBeChecked(token) {
	if (token.isComment() || token.isStringLiteral())
		return false;
	if (token.s[0] === "'") // long string literal
		return false;
	return true;
}

function tokensToCode(tokens) {
	const result = new StringBuffer();
	let lineIndex = 0;
	let colIndex = 0;
	for (const token of tokens) {
		if (lineIndex < token.lineIndex) {
			result.append('\n'.repeat(token.lineIndex - lineIndex));
			lineIndex = token.lineIndex;
			colIndex = 0;
		}
		if (token.s.indexOf('\n') === -1) {
			const spaceCount = token.colIndex - colIndex - token.s.length;
			if (spaceCount > 0)
				result.append(' '.repeat(spaceCount));
		}
		result.append(token.s);
		colIndex = token.colIndex;
	}
	return result.toString();
}

export function shouldNotShowAutofixPromptForCode(code) {
	const tokens = LogoScanner.scan(code);
	code = tokensToCode(tokens.filter(shouldBeChecked));
	if (code.indexOf('http://') !== -1 || code.indexOf('https://') !== -1)
		return true;
	return false;
};