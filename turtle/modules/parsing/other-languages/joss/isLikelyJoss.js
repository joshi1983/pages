import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of BASIC
	/(^|[\r\n])\s*REM\s/,
	/(^|[\r\n])\s*(\d+[ \t]+)?DIM\s/,
	/(^|[\r\n])\s*(function|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,

	// indicators of several other programming languages.
	// Various ways to define functions or subroutines
	/(^|[\r\n])\s*(def|func|function|sub)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*\d+(.\d+)?[ \t]+Set[ \t]+[a-zA-Z][ \t]*=[ \t]*/,
	/(^|[\r\n])\s*Let[ \t]+[a-zA-Z][ \t]*\([ \t]*[a-zA-Z][ \t]*(,[ \t]*[a-zA-Z][ \t]*)*\)[ \t]*=/
];

export function isLikelyJoss(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};