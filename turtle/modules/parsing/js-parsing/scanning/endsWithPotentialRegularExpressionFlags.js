import { isRegularExpressionFlags } from './isRegularExpressionFlags.js';

export function endsWithPotentialRegularExpressionFlags(s) {
	const index = s.lastIndexOf('/');
	if (index === -1)
		return false;
	const potentialFlags = s.substring(index + 1);
	return isRegularExpressionFlags(potentialFlags);
};