import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*@import\s+['"]/,
		// a pattern found in CSS import statements

	// indicators of Gleam
	/(^|[\r\n])\s*import[ \t]+(gleam|gleeunit)[ \t]*([\r\n]|\/[ \t]*[a-z_])/,
];
const likelyRegexes = [
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@import\([ \t]*"std"[ \t]*\)/,
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@cImport\(/,
	/(^|[\r\n])\s*@cInclude[ \t]*\([ \t]*"/,

	/(^|[\r\n])\s*pub[ \t]+fn[ \t]+main[ \t]*\([ \t]*\)/
		// might match code from Gleam and Rust too
];

export function isLikelyZig(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	
	return false;
};