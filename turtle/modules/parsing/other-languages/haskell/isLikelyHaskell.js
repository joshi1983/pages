import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Ada
	/(^|[\r\n])\s*with[ \t]+Ada./,
	/(^|[\r\n])\s*use[ \t]+Ada[ \t]*;/,

	// indicators of Lua
	/(^|[\r\n])\s*local[ \t]+function[ \t]+/,
	/(^|[\r\n])\s*local[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=/, 

	// indicators of Python
	/(^|[\r\n])\s*import[ \t]+turtle\s/,
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import/,
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*{-#[ \t]+LANGUAGE\s/,
	/(^|[\r\n])[ \t]*import[ \t]+Control.Monad/,
	/(^|[\r\n])[ \t]*main[ \t]*=[ \t]*(do\s*[\r\n]|(print|putStr|putStrLn)\s)/,
	/(^|[\r\n])[ \t]*[a-z_][a-z_\d]*[ \t]+(\d+[ \t]+)+=[ \t]*[a-z\d]/i,
	/(^|[\r\n])[ \t]*forM_[ \t]+\[[ \t]*\d+../
];

const weakLikelyRegexes = [
	/(^|[\r\n])[ \t]*--/, // comments in Haskell, Lua, and Ada
		// some unlikelyRegexes were added to prevent the other languages from
		// leading to a true result.
	
	/(^|[\r\n])[ \t]*{-#[ \t]+/,
	/(^|[\r\n])[ \t]*data[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=/,
	/(^|[\r\n])[ \t]*import[ \t]+Control.Concurrent/,
	/(^|[\r\n])[ \t]*putStrLn[ \t]+[a-zA-Z"\$]/,
	/(^|[\r\n])[ \t]*[a-z_]+[ \t]+\$[ \t]+/i,
	/(^|[\r\n])[ \t]*[a-zA-Z_]+[ \t]+::[ \t]+[\(\[]*(Bool|Char|Float|Int|String)/,
	/(^|[\r\n])[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]+<-[ \t]+[a-zA-Z_][a-zA-Z_\d]*/i
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])[ \t]*{-#/.test(code)) {
		if (code.indexOf('#-}') === -1)
			return true;
	}
	if (/(^|[\r\n])\s*if[ \t]/.test(code)) {
		// if-statements in Haskell must include "then".
		if (!/[\)\]\s]then[\(\[\s]/.test(code))
			return true;

		// if-statements in Haskell must have "else".
		if (!/[\)\]\s]else[\(\[\s]/.test(code))
			return true;
	}
	return false;
}

export function isLikelyHaskell(code) {
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