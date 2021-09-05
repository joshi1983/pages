import { matchesARegex } from '../helpers/matchesARegex.js';
import { matchesARegexSet } from '../helpers/matchesARegexSet.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyRegexes = [
	// indications of other Logo dialects:
	/(^|[\r\n])\s*(backward|forward)\s+/i,
	/(^|[\r\n])\s*to\s+[a-z_]/i,
	/(^|[\r\n])\s*repeat\s\d/i
];

const likelyRegexes = [
	/(^|[\r\n])\s*(lokal|setze)\s+"[a-z]/i,
		// should match the German equivalents to 'local' and make command calls.

	/(^|[\r\n])\s*(weiderhole|wh)\s+\d+\s*\[/i,
		// should match the equivalent to repeat statement.
		
	/(^|[\r\n])\s*rueckgabe\s+[\d:]/i // similar to an output statement in WebLogo
];

const likelyRegexSets = [
	[/(^|[\r\n])\s*pr\s+[a-z_][a-z_\d.]*\s*(\s:|[\r\n])/i, /[\r\n]\s*ende\s*([\r\n]|$)/i],
		// should match procedure most definitions in the German dialects of Logo.

	[/(^|[\r\n])\s*wenn\s+/i, /\sdann\s/i]
		// should match German if-then statements.
];

export function isLikelyGermanLogo(code) {
	code = naiveStripComments(code.toLowerCase());
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	if (matchesARegexSet(likelyRegexSets, code))
		return true;
	return false;
};