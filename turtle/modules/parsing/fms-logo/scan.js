import { getStartColOffset } from
'../generic-parsing-utilities/getStartColOffset.js';
import { getStartLineIndex } from
'../generic-parsing-utilities/getStartLineIndex.js';
import { LogoScanner } from '../LogoScanner.js';
import { StringUtils } from '../../StringUtils.js';

export function isOriginString(s) {
	return /^\@[0-9]+$/.test(s);
};

function shouldBeMerged(before, after, codeLines) {
	if (before === undefined)
		return false;
	// does after start on the same line as before ends?
	const afterStartLineIndex = after.lineIndex - StringUtils.countChar(after.s, '\n');
	if (afterStartLineIndex !== before.lineIndex)
		return false;
	if (before.s.length === 1 &&
	(before.s !== '}' || !isOriginString(after.s))) {
		if ('[](){}'.indexOf(before.s) !== -1)
			return false;
	}
	const codeLine = codeLines[before.lineIndex];
	const c = codeLine[before.colIndex + 1];
	if (c === undefined || c.trim() === '')
		return false;
	if (after.s.length === 1) {
		if ('[](){}:'.indexOf(after.s) !== -1)
			return false;
	}
	return true;
}

function addSubtokens(token, result, prev, codeLines) {
	const subtokens = LogoScanner.getTokensForParsing(token.s.substring(1));
	const startLineIndex = getStartLineIndex(token);
	const startColIndex = getStartColOffset(token, codeLines);
	for (let i = 0; i < subtokens.length; i++) {
		const subtoken = subtokens[i];
		if (subtoken.lineIndex === 0)
			subtoken.colIndex += startColIndex + 1;
		subtoken.lineIndex += startLineIndex;
		if (shouldBeMerged(prev, subtoken, codeLines)) {
			if (i === 0)
				prev.s += "'";
			prev.s += subtoken.s;
			const lineCount = StringUtils.countChar(subtoken.s, '\n');
			prev.lineIndex += lineCount;
			prev.colIndex = subtoken.colIndex;
		}
		else {
			if (i === 0) {
				subtoken.s = "'" + subtoken.s;
			}
			result.push(subtoken);
			prev = subtoken;
		}
	}
}

function shouldMergeUnquotedTokens(before, after, codeLines) {
	if (before === undefined || before.s !== '}' ||
	!isOriginString(after.s))
		return false;
	return shouldBeMerged(before, after, codeLines);
}

/*
WebLogo and FMSLogo code are very similar so reusing WebLogo's scanner 
should be good most of the time.

Long string literals are a feature unique to WebLogo, though.
The following mostly reuses WebLogo's scanner but gives special attention to long string literals.
*/
export function scan(code) {
	const tokens = LogoScanner.getTokensForParsing(code);
	const codeLines = code.split('\n');
	const result = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		// if any are long string literals, process them more.
		if (token.s[0] === '\'') {
			addSubtokens(token, result, tokens[i - 1], codeLines);
		}
		else if (shouldMergeUnquotedTokens(tokens[i - 1], token, codeLines)) {
			const prev = tokens[i - 1];
			prev.s = prev.s + token.s;
			prev.colIndex = token.colIndex;
			prev.lineIndex = token.lineIndex;
		}
		else
			result.push(token);
	}
	return result;
};