import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*;/,
		// indicator of Logo and assembly
		// ; is used for single-line comments

	/(^|[\r\n])\s*(function|sub)\s+[a-z_][a-z\d_]*\s*\(/i,
		// indicator of QBasic
		
		// indicators of Ocaml
	/(^|[\r\n])\s*fun[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*->/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*\|>[ \t]*(Array|Async|List|Seq|String)[ \t]*\./,
	/(^|[\r\n])\s*\[[ \t]*for[ \t]+[A-Za-z_][A-Za-z_\d]*[ \t]+in[ \t]+/,
	/(^|[\r\n])\s*async[ \t]*\{[ \t]*return[ \t]+/,
	/(^|[\r\n])\s*let[ \t]+rec[ \t]+[a-zA-Z_][a-z_\d]*[ \t]*=[ \t]*function\s/,

	/(^|[\r\n])\s*open[ \t]+System[ \t]*(\.[ \t]*[A-Z][a-z\d]*)+/,
	/(^|[\r\n])\s*\[<System[ \t]*(\.[ \t]*[A-Z][a-z\d]*)+>\]/,
	/(^|[\r\n])\s*printfn[ \t]+"/,
	/(^|[\r\n])\s*let[ \t]+[a-zA-Z][a-zA-Z\d]*[ \t]*=[ \t]*\[\s*\d+(\.\d*)?\s*;/,
	/(^|[\r\n])\s*\|[ \t]*\d+[ \t]*\->\s/
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*\(\*\s[^\*]*\*\)/,
		// a comment in f#

	/(^|[\r\n])\s*let[ \t]+[A-Za-z_][A-Za-z_\d]*[ \t]*=[ \t]*@"/,
	/(^|[\r\n])\s*let[ \t]+[A-Za-z_][A-Za-z_\d]*[ \t]*=[ \t]*\{\s*[A-Za-z_][A-Za-z_\d]*\s*=\s*["\d]/,

	/(^|[\r\n])\s*match[ \t]+[A-Za-z_][a-z_\d]*[ \t]+with\s/,

	/(^|[\r\n])\s*type[ \t]+[A-Z][a-z_\d]*[ \t]*=[ \t]*\{/,
		// for example, type Person = {

	/(^|[\r\n])\s*type[ \t]+[A-Z][a-z_\d]*\([A-Za-z_][A-Za-z_\d]*[ \t]*:[ \t]*(bigint|BigRational|s?byte|decimal|float(32)?|int|u?int(16|32|64)|sbyte|string)[ \t]*[,\)]/,
	/(^|[\r\n])\s*member[ \t]+[A-Za-z_][A-Za-z_\d]*[ \t]*\.[A-Za-z_][A-Za-z_\d]*[ \t]*=/
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])\s*if[\s\(]/.test(code)) {
		if (!/[\s\)]then[\s]/.test(code))
			return true;
	}
	return false;
}

export function isLikelyFSharp(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	
	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) > 1)
		return true;

	return false;
};