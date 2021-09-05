import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const unlikelyRegexes = [
	// indicators of Python
	/(^|[\r\n])\s*import[ \t]+turtle\s/,
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import\s/,

	// some indications of POV-ray scripts
	/(^|[\r\n])[ \t]*#include\s*\"/,
	/(^|[\r\n])[ \t]*#declare\s+[a-zA-Z_]/,

	// some indicators of HolyC, c, c++...
	/(^|[\r\n])[ \t]*#include[ \t]*</,
];

const likelyRegexes = [
];

const likelyRegexSets = [
	[
		/(^|[\r\n])\s*class[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s*[\r\n#]/,
		/[\r\n]\s*end\s*([\r\n#]|$)/
	], // class definition

	[
		/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*[\?]?[ \t]*[\r\n\(#]/,
		/[\r\n]\s*end\s*([\r\n#]|$)/
	], // function definition

	[
		/(^|[\r\n])\s*\=begin\s*[\r\n]/,
		/[\r\n]\s*\=end\s*([\r\n]|$)/
	] // multiline comment begin and end
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*\#\s/, // a single line comment
	/(^|[\r\n])\s*require_relative[ \t]+'/,
	/(^|[\r\n])\s*include[ \t]+[a-zA-Z_]/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*.[ \t]*new[ \t]*\(/,
	/(^|[\r\n])\s*:[a-zA-Z_][a-zA-Z_\d]*[ \t]*!=/,
	/(^|[\r\n])\s*{[ \t]*:[a-zA-Z_][a-zA-Z_\d]*[ \t]*=>/
];

export function isLikelyRuby(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (matchesARegexSet(likelyRegexSets, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};