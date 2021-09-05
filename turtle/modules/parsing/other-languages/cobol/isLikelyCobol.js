import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const unlikelyPatterns = [
];
const likelyPatterns = [
	/(^|[\r\n])\s*identification[ \t]+division[ \t]*.([\r\n]|$)/i,
	/(^|[\r\n])\s*MOVE[ \t]+-?(\d+|[a-z][a-z\d-]*)[ \t]+TO[ \t]+[a-z][a-z\d-]*.\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*STOP[ \t]+RUN[ \t]*.\s*([\r\n]|$)/i
];
const likelyPatternSets = [
	[ /(^|[\r\n])\s*if\s/i, 
		/[ \t]+THEN\s*[\r\n]/i,
		/(^|[\r\n])\s*END-IF\s*([\r\n]|$)/i
	]
];

export function isLikelyCobol(code) {
	if (matchesARegex(unlikelyPatterns, code))
		return false;

	if (matchesARegex(likelyPatterns, code))
		return true;

	if (matchesARegexSet(likelyPatternSets, code))
		return true;

	return false;
};