import { canBeCompleteRegularExpressionPattern } from './canBeCompleteRegularExpressionPattern.js';
import { endsWithPotentialRegularExpressionFlags } from './endsWithPotentialRegularExpressionFlags.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';

export function isCompleteRegularExpression(s) {
	if (s.length < 3)
		return false;
	if (!isStartingRegularExpression(s))
		return false;
	if (!endsWithPotentialRegularExpressionFlags(s))
		return false;
	const lastSlashIndex = s.lastIndexOf('/');
	const patternPart = s.substring(1, lastSlashIndex);
	return canBeCompleteRegularExpressionPattern(patternPart);
};