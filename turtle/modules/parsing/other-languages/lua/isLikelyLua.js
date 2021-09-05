import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?sub[ \t]+[a-z][a-z\d]*[ \t]*\(/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?end[ \t]+sub(['\s]|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(endif|wend)[ \t]*(['\r\n]|$)/i,

	// indicators of Logo
	/(^|[\r\n])\s*(backward|forward|right|left|rt)[ \t]+-?\d/i,
	/(^|[\r\n])\s*to[ \t]+[a-z_\.][a-z_\.\d]*[ \t]+:[a-z_\.]/i,
	/(^|[\r\n])\s*repeat[ \t]+\d+[ \t]+\[/i,

	// indicator of JAI (from Jonathan Blow)
	/(^|[\r\n])[ \t]*#import[ \t]+"/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*type_of[ \t]*\(/,

	/(^|[\r\n])\s*import[ \t]+[A-Za-z_][A-Za-z_\d]*/
		// matches code from Elm, Python, Java, JavaScript(ECMAScript 7 import statements)
];

const likelyRegexes = [
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\d+[ \t]*(,[ \t]*\d+[ \t]*)+[ \t]+do/,
	/(^|[\r\n])\s*local[ \t]+function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*local[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\{/,
	/(^|[\r\n])\s*if[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*==[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]+then\s/,
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*--\s/,
		// single line comment in Lua
		// could match Haskell, Ocaml but should be very rare or invalid in most other programming languages.
	
	/(^|[\r\n])\s*if[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+then\s/,
		// for example, if nil then
];

function hasMissingPattern(code) {
	const includesEnd = /(^|[\r\n])\s*end\s*([\r\n]|$)/.test(code);
	if (/(^|[\r\n])\s*if[ \t]/.test(code)) {
		// if-statements in Lua must include "then".
		if (!/\sthen\s/.test(code))
			return true;

		// if-statements in Lua must end with "end".
		if (!includesEnd)
			return true;
	}
	if (/(^|[\r\n])\s*for[ \t]/.test(code)) {
		// for-loops in Lua must include "do".
		if (!/\sdo\s/.test(code))
			return true;

		if (!includesEnd)
			return true;
	}
	if (/(^|[\r\n])\s*(local[ \t]+)?function[ \t]/.test(code)) {
		if (!includesEnd)
			return true;
	}
	return false;
}

export function isLikelyLua(code) {
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