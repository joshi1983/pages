import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Logo
	/(^|[\r\n])\s*(backward|forward|right|left|rt)[ \t]+-?\d/i,
	/(^|[\r\n])\s*to[ \t]+[a-z_\.][a-z_\.\d]*[ \t]+:[a-z_\.]/i,
	/(^|[\r\n])\s*repeat[ \t]+\d+[ \t]+\[/i,
];

const likelyRegexes = [
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\d+[ \t]*(,[ \t]*\d+[ \t]*)+[ \t]+do/,
	/(^|[\r\n])\s*local[ \t]+function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*local[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\{/,
	/(^|[\r\n])\s*if[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*==[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]+then\s/,
	/(^|[\r\n])\s*if[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+then\s/
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

	return false;
};