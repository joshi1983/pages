import { isCompleteStringLiteral } from './isCompleteStringLiteral.js';
import { isIdentifier } from './isIdentifier.js';
import { isNumberLiteral } from './isNumberLiteral.js';
import { mightBeDirective } from './mightBeDirective.js';
const singleCharTokens = new Set('=*?:'.split(''));

export function isMarkingEndOfToken(s, nextChar) {
	if (isNumberLiteral(s) && !isNumberLiteral(s + nextChar))
		return true;
	if (isIdentifier(s) && !isIdentifier(s + nextChar))
		return true;
	if (mightBeDirective(s) && !mightBeDirective(s + nextChar))
		return true;
	if (nextChar.trim() === '')
		return true;
	if (singleCharTokens.has(s))
		return true;
	if (s === '/' && nextChar !== '*' && nextChar !== '/')
		return true;
	if ((s === '+' || s === '-') && !isNumberLiteral(s + nextChar))
		return true;
	if (s === '!' && nextChar !== '=')
		return true;
	if (s === '!=')
		return true;
	if (s === '.' && !isNumberLiteral(s + nextChar))
		return true;
	if (isCompleteStringLiteral(s))
		return true;
	return false;
};