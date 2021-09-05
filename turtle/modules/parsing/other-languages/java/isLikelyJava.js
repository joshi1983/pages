import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicator of Python
	/(^|[\r\n])\s*#/,

	// some indicators of Processing.
	// Processing is so similar to Java that it essentially is a slightly altered Java.
	/(^|[\r\n])\s*void\s+setup\(\s*\)\s*\{/,
	/(^|[\r\n])\s*void\s+draw\(\s*\)\s*\{/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*import[ \t]+ch.aplu.turtle/
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*public[ \t]+static[ \t]+void[ \t]+main[ \t]*\(\s*String/,
	/[=\s]new\s+World\(/,
	/[=\s]new\s+Turtle\(/,
];

const necessaryPatterns = [
	/(^|[\r\n])\s*(protected|public\s+)?class\s+[a-zA-Z_][a-zA-Z_\d]*/
];

function hasNecessaryJavaFilePatterns(code) {
	const substrings = ['{', '}'];
	for (const s of substrings)
		if (code.indexOf(s) === -1)
			return false;

	for (const r of necessaryPatterns) {
		if (!r.test(code))
			return false;
	}
	return true;
}

export function isLikelyJava(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (!hasNecessaryJavaFilePatterns(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes))
		return true;

	return false;
};