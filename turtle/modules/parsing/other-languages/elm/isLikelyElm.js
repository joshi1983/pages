import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// some single line comment markers from other programming languages
	/(^|[\r\n])[ \t]*\/\//, // c, c++, c#, HolyC, Java, JavaScript
	/(^|[\r\n])[ \t]*%/, // Pascal
	
	/(^|[\r\n])[ \t]*(function|procedure|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// matches a lot of Basic, JavaScript, and Pascal code

	// indicators of Haskell
	/(^|[\r\n])[ \t]*{-#[ \t]+/,
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*import[ \t]+[A-Z][a-z_\d]*([ \t]*.[ \t]*[A-Z][a-z_\d]*)*[ \t]+exposing[ \t]*\(/
];
const weakLikelyRegexes = [
	/(^|[\r\n])\s*--/,
		// single line comments in Elm
		// This is also a single line comment in Haskell.
	/(^|[\r\n])\s*{-\|\s/,

	/(^|[\r\n])\s*Elm[ \t]*./,

	/(^|[\r\n])[ \t]*[a-zA-Z_]+[ \t]+:[ \t]+[\(\[]*(Bool|Float|Int|number)/,
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])[ \t]*{-\|/.test(code)) {
		// multiline comments should end with -}.
		if (code.indexOf('-}') === -1)
			return true;
	}
	return false;
}

export function isLikelyElm(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};