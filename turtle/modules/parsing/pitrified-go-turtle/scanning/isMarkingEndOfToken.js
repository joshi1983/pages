import { isCharacterLiteralStart } from './isCharacterLiteralStart.js';
import { isCommentStart } from './isCommentStart.js';
import { isCompleteCharacterLiteral } from './isCompleteCharacterLiteral.js';
import { isCompleteNumberLiteral} from './isCompleteNumberLiteral.js';
import { isCompleteStringLiteral } from './isCompleteStringLiteral.js';
import { isFloatingPointLiteralStart } from './isFloatingPointLiteralStart.js';
import { isIdentifier } from './isIdentifier.js';
import { isSingleLineCommentStart } from './isSingleLineCommentStart.js';
import { isStartOfOperator } from './isStartOfOperator.js';
import { isStringLiteralStart } from './isStringLiteralStart.js';
import { StringUtils } from '../../../StringUtils.js';

const singleCharTokens = new Set('(){}[];.,~'.split(''));

export function isMarkingEndOfToken(prev, nextChar) {
	if (isCompleteStringLiteral(prev) ||
	isCompleteCharacterLiteral(prev))
		return true;
	else if (isStringLiteralStart(prev) || 
	isCharacterLiteralStart(prev))
		return false;
	if (prev === '.' && nextChar.toLowerCase() === 'e')
		return true;
	if (/^\.+$/.test(prev + nextChar))
		return false;
	if (isCompleteNumberLiteral(prev + nextChar))
		return false;
	if (isCompleteNumberLiteral(prev) && '~!@#$%^&|*/\\()[]{}<>='.indexOf(nextChar) !== -1)
		return true;
	if (isFloatingPointLiteralStart(prev + nextChar))
		return false;
	if (prev !== '' && isFloatingPointLiteralStart(prev))
		return true;
	if (/^\.{2,}$/.test(prev) && nextChar !== '.')
		return true;
	if (prev === '/' && (nextChar === '/' || nextChar === '*'))
		return false;
	if (isSingleLineCommentStart(prev))
		return nextChar === '\n';
	if (prev.startsWith('/*'))
		return prev.endsWith('*/');
	if (prev === '/' && nextChar === '*')
		return false;
	if (singleCharTokens.has(nextChar) || singleCharTokens.has(prev))
		return true;
	if (isIdentifier(prev) && !isIdentifier(prev + nextChar))
		return true;
	if (!isCommentStart(prev) &&
	StringUtils.isWhitespace(nextChar))
		return true;
	if (isStartOfOperator(prev) && !isStartOfOperator(prev + nextChar))
		return true;
	return false;
};