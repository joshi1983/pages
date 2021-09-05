import { fetchJson } from '../../../fetchJson.js';
import { isCommentPrefix } from './isCommentPrefix.js';
import { isDigit } from '../../../isDigit.js';
import { isValidIdentifier } from './isValidIdentifier.js';
const operators = await fetchJson('json/logo-migrations/processing/Operators.json');

const charsBeforeRegEx = new Set('([{'.split(''));
const charsNotBeforeDivision = new Set('-`~!@#$%^&*|\;"<>,.?='.split(''));
const nonDivAfterChars = new Set('^$*)}]&,='.split(''));
const operatorSymbols = new Set(operators.map(info => info.symbol));

function mightBeOperator(s) {
	return operatorSymbols.has(s);
}

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
*/
export function isTrailMarkingEndOfToken(tailString, currentTokenString, nextChar) {
	if (isCommentPrefix(tailString))
		return false;
	if (currentTokenString.length >= 1 && mightBeOperator(currentTokenString) &&
	!mightBeOperator(currentTokenString + nextChar) &&
	!isCommentPrefix(currentTokenString + nextChar)) {
		if (canStringBeBeforeDivisionOperator(tailString) && isCharacterAfterDivision(nextChar)) {
			return true;
		}
	}
	return false;
};