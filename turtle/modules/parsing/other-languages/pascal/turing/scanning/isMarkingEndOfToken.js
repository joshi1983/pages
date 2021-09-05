import { isCompleteStringLiteral } from './isCompleteStringLiteral.js';
import { isIdentifier } from './isIdentifier.js';
import { isMultilineCommentComplete } from
'./isMultilineCommentComplete.js';
import { isMultilineCommentStart } from
'./isMultilineCommentStart.js';
import { isNumberLiteralStart } from './isNumberLiteralStart.js';
import { isOperatorStart } from './isOperatorStart.js';
import { isStringLiteralStart } from './isStringLiteralStart.js';
import { StringUtils } from
'../../../../../StringUtils.js';

const singleCharacterTokens = new Set('[]();,'.split(''));
const startCheckers = [
	isIdentifier,
	isNumberLiteralStart,
	isOperatorStart
];

export function isMarkingEndOfToken(s, nextChar) {
	if (s[0] ==='%') {
		if (nextChar === '\n')
			return true;
		return false;
	}
	if (s === '/' && nextChar === '*')
		return false;
	if (isMultilineCommentStart(s)) {
		return isMultilineCommentComplete(s);
	}
	if (singleCharacterTokens.has(s))
		return true;

	if (isCompleteStringLiteral(s))
		return true;

	if (isStringLiteralStart(s))
		return false;

	if (isOperatorStart(s) && StringUtils.isWhitespace(nextChar))
		return true;

	for (const startChecker of startCheckers) {
		if (startChecker(s + nextChar))
			return false;
	}
	for (const startChecker of startCheckers) {
		if (startChecker(s))
			return true;
	}
	if (StringUtils.isWhitespace(nextChar))
		return true;

	return false;
};