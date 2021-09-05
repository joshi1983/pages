import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*\/\//,
	/(^|[\r\n])\s*\/\*/,
	/(^|[\r\n])\s*#(declare|ifn?def)[ \t]+[A-Z_]/,
	/(^|[\r\n])\s*#include[ \t]*[<"]/,
		// matches c and c++ code.

	/(^|[\r\n])\s*(ELSE|GLOBAL)[ \t]+\$\(/,
	/(^|[\r\n])\s*procedure[ \t]+[a-z_][a-z_\d]*[ \t]+is\s/i,
		// procedure is in Turing.
	
	// indicators of Python
	/(^|[\r\n])\s*import[ \t]+turtle\s/,
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import[\s\*]/,
	/(^|[\r\n])\s*(def|fn)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// The fn can match Rust too.

	/(^|[\r\n])\s*end[ \t]+(function|if|loop|sub)\s*([\r\n]|$)/i,
		// can match some Basic and Turing programs.
	
	/(^|[\r\n])\s*if[ \t]+[a-zA-Z_\d]/,
		// Verse would follow if with spaces and a ( 
		// instead of having the condition immediately.
];
const likelyRegexes = [
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:=[ \t]*class\(/,
	/(^|[\r\n])\s*[a-zA-Z_]+<(internal|private|protected|public)>[ \t]*:=[ \t]*[a-zA-Z_\d"]/,
	/(^|[\r\n])\s*[A-Z][a-zA-Z_\d]*[ \t]*\([ \t]*([A-Z][a-zA-Z_\d]*[ \t]*:[ \t]*(any|char|float|int|logic|rational|string|void)[ \t]*)*\)[ \t]*(<[a-z]*>[ \t]*)+:[ \t]*(any|char|float|int|logic|rational|string|void)[ \t]*=/,
		// for example, 
		
	/(^|[\r\n])\s*var[ \t]+[A-Z][a-z]*:(any|char|float|int|logic|rational|string)[ \t]*=[ \t]*[A-Za-z\d]/
];
const weakLikelyRegexes = [
	/(^|[\r\n])\s*#/,
		// This would also be matched by Python, c, c++, POV Ray.
		// some unlikelyRegexes help prevent confusion with those other languages.

	/(^|[\r\n])\s*[a-z_][a-z_\d]*[ \t]*:=[ \t]*[a-z\d]/i,
		// for example, Score := 3
	
	/(^|[\r\n])\s*else:\s*[\r\n]/,

	/(^|[\r\n])\s*[a-zA-Z_]+<(internal|private|protected|public)>[ \t]/,

	/(^|[\r\n])\s*set[ \t]+[A-Z][a-zA-Z_]*[ \t]*[-+\*\/]?=[ \t]*[A-Za-z\d"]/,
		// for example, set Score += 2
		
	/(^|[\r\n])\s*Print\(\"/
];

export function isLikelyVerse(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};