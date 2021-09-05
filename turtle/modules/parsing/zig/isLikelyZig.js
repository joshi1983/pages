import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*@import\s+['"]/,
		// a pattern found in CSS import statements
];
const likelyRegexes = [
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@import\([ \t]*"std"[ \t]*\)/,
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@cImport\(/,
	/(^|[\r\n])\s*@cInclude[ \t]*\([ \t]*"/,
	/(^|[\r\n])\s*pub[ \t]+fn[ \t]+main[ \t]*\([ \t]*\)/
];

export function isLikelyZig(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	
	return false;
};