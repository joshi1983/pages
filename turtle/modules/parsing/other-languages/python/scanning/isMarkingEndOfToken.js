import { isBytesLiteral } from './isBytesLiteral.js';
import { isBytesLiteralStart } from './isBytesLiteralStart.js';
import { isCompleteIndent } from './isCompleteIndent.js';
import { isDecoratorStart } from './isDecoratorStart.js';
import { isIdentifier } from './isIdentifier.js';
import { isNumberLiteralStart } from './isNumberLiteralStart.js';
import { isStartOfOperator } from './isStartOfOperator.js';
import { PythonOperators } from '../PythonOperators.js';

const singleCharTokens = new Set('()[]{}:\t,'.split(''));
const patterns = [isIdentifier, isNumberLiteralStart];
const completeCheckers = [isBytesLiteral, isCompleteIndent];

export function isMarkingEndOfToken(s, nextChar) {
	for (const completeChecker of completeCheckers) {
		if (completeChecker(s))
			return true;
	}
	if (s !== '' && s.trim() === '' && nextChar.trim() !== '')
		return true;
	if (isBytesLiteralStart(s + nextChar) || isDecoratorStart(s + nextChar))
		return false;
	if (isIdentifier(s + nextChar))
		return false;
	if (PythonOperators.getOperatorInfo(s + nextChar) !== undefined ||
	isNumberLiteralStart(s + nextChar))
		return false;
	if (PythonOperators.getOperatorInfo(s) !== undefined &&
	!isStartOfOperator(s + nextChar))
		return true;
	if (singleCharTokens.has(nextChar) || singleCharTokens.has(s))
		return true;
	for (const pattern of patterns) {
		if (pattern(s) && !pattern(s + nextChar))
			return true;
	}
	if (nextChar === '\t')
		return true;
	return false;
};