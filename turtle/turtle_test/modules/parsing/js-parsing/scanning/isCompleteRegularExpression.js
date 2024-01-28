import { canBeCompleteRegularExpressionPattern } from './canBeCompleteRegularExpressionPattern.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';


// https://www.codeguage.com/courses/regexp/flags
const flagsString = 'gimsuy';
const flags = new Set(flagsString.split(''));

function isRegularExpressionFlags(s) {
	if (s.length > flagsString.length)
		return false;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (!flags.has(ch))
			return false;
	}
	return true;
}

export function isCompleteRegularExpression(s) {
	if (s.length < 3)
		return false;
	if (!isStartingRegularExpression(s))
		return false;
	const lastSlashIndex = s.lastIndexOf('/');
	const flagsPart = s.substring(lastSlashIndex + 1);
	if (!isRegularExpressionFlags(flagsPart))
		return false;
	const patternPart = s.substring(1, lastSlashIndex);
	return canBeCompleteRegularExpressionPattern(patternPart);
};