import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyRegexes = [];

const signals = [
	/(^|[\r\n])\s*repeat[ \t]\d+\s*\(/i, // for example, REPEAT 4 (FD 60 RT 90)
		// WebLogo and most other Logo dialects uses square brackets for repeat's instruction list.
	/(^|[\r\n])\s*to\s+[a-z]+\-/i,
		// For example, TO LINE-OF-DOTS
		// Unlike most other Logo dialects, SuperLogo allows hyphens(-) to be in procedure names.
		// I'm not sure if that also applies to variable names.
		// See page 64 at:
		// https://colorcomputerarchive.com/repo/Documents/Manuals/Programming/Super%20Logo%20(Tandy).pdf
];

export function isLikelySuperLogo(code) {
	code = naiveStripComments(code.toLowerCase());
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};