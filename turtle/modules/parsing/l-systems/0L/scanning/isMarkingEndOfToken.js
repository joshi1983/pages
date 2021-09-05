import { isArrowStart } from './isArrowStart.js';
import { isCompleteArrow } from './isCompleteArrow.js';
import { isCompleteComment } from './isCompleteComment.js';
import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isCommentStart } from './isCommentStart.js';
import { isIdentifier } from './isIdentifier.js';
import { isNumberLiteral } from './isNumberLiteral.js';
import { StringUtils } from '../../../../StringUtils.js';

const breakingFunctions = [
	isCompleteArrow, isCompleteComment
];
const singleCharTokens = new Set('+={}|[]()!@&#<');

export function isMarkingEndOfToken(s, nextChar, oneCharacterIdentifiers) {
	if (s !== '') {
		if (singleCharTokens.has(s)||singleCharTokens.has(nextChar))
			return true;
		if (oneCharacterIdentifiers === true && isIdentifier(s))
			return true;
		if (isCompleteNumberLiteral(s) && !isCompleteNumberLiteral(s + nextChar))
			return true;
		if (s === '>')
			return true;
		if (isCommentStart(s) && nextChar !== '\n')
			return false;
		if (StringUtils.isWhitespace(nextChar))
			return true;
		for (const f of breakingFunctions) {
			if (f(s)) {
				return true;
			}
		}
		if (isNumberLiteral(s + nextChar))
			return false;
		if (s.endsWith('.') && /\d/.test(nextChar) === false)
			return true;
		if (isArrowStart(s) && !isArrowStart(s + nextChar))
			return true;
		if (!isIdentifier(s + nextChar) && isIdentifier(s)) {
			return true;
		}
	}
	return false;
};