import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { isSelectorValueStart } from './isSelectorValueStart.js';
import { isStartingNumberLiteral } from './isStartingNumberLiteral.js';
import { isStartOfPseudoClass } from './isStartOfPseudoClass.js';

const completeTokens = new Set([
	'*', '*=', '$=', '^=', '/=', '~=', '=', '/', '>=', '>', '<=', '<', '|', '||'
]);
function isDigit(ch) {
	return /\d/.test(ch);
}

function isHexDigit(ch) {
	return /[\da-f]/i.test(ch);
}

export function isMarkingEndOfToken(s, nextChar) {
	if (!isDigit(nextChar) && !isSelectorValueStart(nextChar)) {
		if (s === '.' || s === '#')
			return true;
	}
	if (completeTokens.has(s + nextChar))
		return false;
	if (s === '/')
		return true;
	if (s === ':' && !isStartOfPseudoClass(s + nextChar))
		return true;
	if (isStartOfPseudoClass(s + nextChar))
		return false;
	if (completeTokens.has(s))
		return true;
	if (completeTokens.has(nextChar))
		return true;
	if (nextChar === '.' && !isStartingNumberLiteral(s + nextChar))
		return true;
	if (nextChar === '$' || nextChar === '~' || nextChar === '^' || nextChar === ':')
		return true;
	if (nextChar === '-' && isCompleteNumberLiteral(s))
		return true;
	if (s !== '' && nextChar === '#')
		return true;
	return false;
};