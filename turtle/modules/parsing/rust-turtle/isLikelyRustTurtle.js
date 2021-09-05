import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@import\([ \t]*"std"[ \t]*\)/,
	/(^|[\r\n])\s*const[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*@cImport\(/,
	/(^|[\r\n])\s*@cInclude[ \t]*\([ \t]*"/,
];

const signals = [
	/(^|[\r\n])[ \t]*fn\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	/(^|[\r\n])[ \t]*use\s+turtle\s*::\s*{/
];

export function isLikelyRustTurtle(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};