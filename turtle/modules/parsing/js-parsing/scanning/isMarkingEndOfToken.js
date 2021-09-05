import { fetchJson } from '../../../fetchJson.js';
import { isCommentPrefix } from './isCommentPrefix.js';
import { isCompleteComment } from './isCompleteComment.js';
import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isCompleteRegularExpression } from './isCompleteRegularExpression.js';
import { isCompleteStringLiteral } from './isCompleteStringLiteral.js';
import { isCompleteTemplateLiteral } from './isCompleteTemplateLiteral.js';
import { isSingleCharacterToken } from './isSingleCharacterToken.js';
import { isStartingNumberLiteral } from './isStartingNumberLiteral.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';
import { isStartingStringLiteral } from './isStartingStringLiteral.js';
import { isStartingTemplateLiteral } from './isStartingTemplateLiteral.js';
import { isValidIdentifierPrefix } from './isValidIdentifierPrefix.js';
import { SetUtils } from '../../../SetUtils.js';
const operators = await fetchJson('json/JavaScript/operators.json');

const binaryOperatorPrefixes = new Set(['']);
operators.forEach(function(operatorInfo) {
	for (let i = 1; i <= operatorInfo.symbol.length; i++) {
		binaryOperatorPrefixes.add(operatorInfo.symbol.substring(0, i));
	}
});
function isStartingBinaryOperator(s) {
	return binaryOperatorPrefixes.has(s);
}

export function isMarkingEndOfToken(s, nextChar) {
	if (s.startsWith('//') && nextChar === '\n')
		return true;
	if (isCompleteStringLiteral(s))
		return true;
	if (isStartingStringLiteral(s))
		return false;
	if (isCompleteTemplateLiteral(s))
		return true;
	if (isStartingTemplateLiteral(s))
		return false;
	if (isCompleteRegularExpression(s) && !isCompleteRegularExpression(s + nextChar))
		return true;
	if (s !== '-' && isStartingNumberLiteral(s) && !isStartingNumberLiteral(s + nextChar))
		return true;
	if (s.length === 1 && isSingleCharacterToken(s))
		return true;
	if (isCompleteComment(s))
		return true;
	if ((s === '.' || s === '..') && nextChar === '.')
		return false;
	if (isStartingBinaryOperator(s) && !isStartingBinaryOperator(s + nextChar) &&
	!isStartingNumberLiteral(s + nextChar) && !isValidIdentifierPrefix(s) && !isCommentPrefix(s + nextChar) && !isStartingRegularExpression(s + nextChar))
			return true;
	if (s !== '' && isValidIdentifierPrefix(s) && !isValidIdentifierPrefix(s + nextChar))
		return true;
	return false;
};