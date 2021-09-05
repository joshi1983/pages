import { matchesARegex } from '../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@import\([ \t]*"std"[ \t]*\)/,
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@cImport\(/,
	/(^|[\r\n])\s*@cInclude[ \t]*\([ \t]*"/,

	// indicators of Gleam
	/(^|[\r\n])\s*import[ \t]+(gleam|gleeunit)[ \t]*([\r\n]|\/[ \t]*[a-z_])/,

	// indicators of WGSL
	/(^|[\r\n])\s*@(builtin|location)\(/,
	/(^|[\r\n])\s*@(fragment|vertex)\s/,
];

const signals = [
	/(^|[\r\n])[ \t]*fn\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
		// might match some Zig and Gleam code too.
	
	/(^|[\r\n])[ \t]*use\s+turtle\s*::\s*{/
];

export function isLikelyRustTurtle(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};