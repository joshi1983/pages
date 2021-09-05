import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Python
	/(^|[\r\n])\s*import[ \t]+turtle\s/i,
	/(^|[\r\n])\s*from[ \t]+turtle\s+import[\*\s]/i,
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*"""/,
	
	// indicators of Ruby
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*[\?]?[ \t]*[\r\n#\(]/,
	/(^|[\r\n])\s*class[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*[\r\n#]/,
	/(^|[\r\n])\s*=begin/,

	// indicators of c, c++, HolyC...
	/(^|[\r\n])\s*#include[ \t]*[<"]/i,
	/(^|[\r\n])\s*#(ifdef|ifndef)[ \t]*[a-zA-Z_]/i,
	/(^|[\r\n])\s*\/\//,
	/(^|[\r\n])\s*(double|float|int|void)\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	/(^|[\r\n])\s*class[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s*\{/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*-[ \t]+:/,
	/(^|[\r\n])\s*\d+(\.\d*)?[ \t]*:[ \t]*(int|real)/,
	/(^|[\r\n])\s*(let[ \t]+)?fun[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\([ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:/,
	/\(\s*let\s+val\s+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*/
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*#/,
	/\(\s*let\s+val\s+[a-zA-Z_][a-zA-Z_\d]*/,
	/;;\s*([\r\n]|$)/
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])\s*if\s/.test(code)) {
		// if-statements in ML always have "then".
		if (!/\sthen\s/.test(code))
			return true;

		// if-statements in ML always have "else".
		if (!/\selse\s/.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*fun[ \t]+[a-zA-Z_]+\s*\(/.test(code)) {
		// Every function in ML should be assigned a value.
		if (code.indexOf('=') === -1)
			return true;
	}
	if (/(^|[\r\n])\s*case[ \t]+[a-zA-Z_]+\s+/.test(code)) {
		// case-statements in ML always have "of".
		if (!/\sof\s/.test(code))
			return true;
	}
	return false;
}

export function isLikelyMetaLanguage(code) {
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