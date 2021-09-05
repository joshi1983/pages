import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Visual Basic.net
	/(^|[\r\n])\s*Module[ \t]+[A-Za-z_][A-Za-z\d_]*\s/,

	// indicators of c and c++
	/(^|[\r\n])\s*#include\s*["<]/
];

const likelyRegexes = [
	/(^|[\r\n])\s*using[ \t]+[a-zA-Z_][a-zA-Z_\d]*(\s*\.\s*[a-zA-Z_][a-zA-Z_\d]*)*\s*;/,
	/(^|[\r\n])\s*namespace[ \t]+[A-Z][a-zA-Z_]*\s*\{/,
	/(^|[\r\n])\s*(Console|Debug)[ \t]*\.[ \t]*(ReadKey|Write|WriteLine)[ \t]*\(/,
];

// some weakLikelyRegexes could be:
// /(^|[\r\n])\s*static[ \t]+void[ \t]+Main[ \t]*\([ \t]*string[ \t]*\[[ \t]*\][ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*\)/
// /(^|[\r\n])\s*internal[ \t]+class[ \t]+[a-zA-Z_][a-zA-Z_\d]*/
// /(^|[\r\n])\s*#endregion\s*[\r\n]/

export function isLikelyCSharp(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};