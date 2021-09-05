import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_]/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*<\?php\s/
];

const methodRegex = /(^|[\r\n])\s*(private|protected|public)[ \t]+(static[ \t]+)?function[ \t]+[a-zA-Z_][\da-zA-Z_]*[ \t]*\(/;
const explicitVisibilityPropertyRegex = /(^|[\r\n])\s*(private|protected|public)[ \t]+\$[a-zA-Z_][a-zA-Z_\d]*[ \t,;]/;

const weakLikelyRegexes = [
	/(^|[\r\n])\s*<html[\s>]/i,
	/(^|[\r\n])\s*echo[ \t]*['"\$]/,
	/(^|[\r\n])\s*foreach[ \t]*\(/,
	/(^|[\r\n])\s*\$[a-z_][a-z_\d]*[ \t]*(\+\+|--)/i,
	// incrementing or decrementing a variable

	/(^|[\r\n])\s*\$[a-z_][a-z_\d]*[ \t]*=[\s\da-z_\$]/i,
	explicitVisibilityPropertyRegex,
	methodRegex,
	/(^|[\r\n])\s*\?>/,
	/(^|[\r\n])\s*require_once[ \t]*\([ \t]*["']/,
		// frequently used function for importing/including other PHP scripts.

	/(^|[\r\n])\s*\$this[ \t]*->[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*=/,
	/(^|[\r\n])\s*self[ \t]*::/
];

function containsInvalidPatternCombination(code) {
	if (methodRegex.test(code) ||
	explicitVisibilityPropertyRegex.test(code)) {
		// private, public, and protected functions and properties should be in a class.
		if (!/(^|\s)class[ \t]+[a-zA-Z_][a-zA-Z_\d]*[:\s\/]/.test(code))
			return true;
	}

	return false;
}

export function isLikelyPHP(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (containsInvalidPatternCombination(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};