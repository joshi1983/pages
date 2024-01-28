import { isCommentPrefix } from './isCommentPrefix.js';
import { isDigit } from '../../../isDigit.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';
import { isValidIdentifier } from './isValidIdentifier.js';

const charsBeforeRegEx = new Set('([{'.split(''));
const charsNotBeforeDivision = new Set('-`~!@#$%^&*|\;"<>,.?='.split(''));
const nonDivAfterChars = new Set('^$*)}]&,='.split(''));

function isCharacterBeforeDivision(ch) {
	if (isDigit(ch))
		return true;
	if (charsBeforeRegEx.has(ch))
		return false;
	if (charsNotBeforeDivision.has(ch))
		return false;
	return true;
}

function canStringBeBeforeDivisionOperator(s) {
	if (s === '')
		return false;
	if (s === 'return')
		return false;
	if (isCharacterBeforeDivision(s[s.length - 1]))
		return true;
	if (isValidIdentifier(s))
		return true;
	return false;
}

function isCharacterAfterDivision(ch) {
	if (nonDivAfterChars.has(ch))
		return false;
	return true;
}

/*
isTrailMarkingEndOfToken is a lot like isMarkingEndOfToken except that it requires more context.

The tailString is a string from a previously pushed token.  
In some rare situations, knowing how the previous token ends can help us determine where the current token should end.
In some cases, it is difficult to know if a / character indicates a division operator or the start of a regular expression.
Knowing the trailing character of tailString can usually push us completely toward / being a division operator 
or a regular expression.
*/
export function isTrailMarkingEndOfToken(tailString, currentTokenString, nextChar) {
	if (currentTokenString.length >= 1 && isStartingRegularExpression(currentTokenString) &&
	!isCommentPrefix(currentTokenString + nextChar)) {
		if (canStringBeBeforeDivisionOperator(tailString) && isCharacterAfterDivision(nextChar)) {
			return true;
		}
	}
	return false;
};