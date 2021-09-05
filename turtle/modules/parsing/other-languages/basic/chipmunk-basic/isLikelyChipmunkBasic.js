import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	// indicators of Logo and WebLogo
	/(^|[\r\n])[ \t]*;/,
	/(^|[\r\n])[ \t]*\/\//,

	/(^|[\r\n])[ \t]*end[ \t]+if[ \t]*([\r\n]|$)/i,
		// Chipmunk Basic uses endif instead of having a space in it.

	/(^|[\r\n])[ \t]*go[ \t]+to[ \t]+/i,
		// Chipmunk Basic uses goto instead of go to.
];

const likelyExpressions = [
	/[=\s\+\-\(]fgetbyte[ \t]*\([ \t]*[a-z\d]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?graphics[ \t]+button[ \t]+"/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?graphics[ \t]+window[ \t]+\d/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?graphics[ \t]+(color|fillrect|pensetup|rect|textsetup)[ \t]+[a-z\d]/i,
	/(^|[\r\n])[ \t]*macFunction[ \t]*\([ \t]*"/i,
	/[=\s\+\-\(>]mouse[ \t]*\([ \t]*[12][ \t]*\)([\s']|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?sprite[ \t]+\d[ \t]+[a-z]/i,
];

const weakLikelyExpressions = [
	/(^|[\r\n])[ \t]*fseek[ \t]+#\d/i,
	/[=\s\+\-\(>]inputbox[ \t]*\([ \t]*"/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(line|move)to[ \t]+[a-z\d]+[ \t]*,/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?sound[ \t]+[a-z\d]+[ \t]*,/i
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])[ \t]*for\s/i.test(code)) {
		if (!/(^|[\r\n])[ \t]*next\s/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*if[\s\(]/i.test(code)) {
		if (!/[ \t\)]then\s/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*sub[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i.test(code)) {
		if (!/(^|[\r\n])[ \t]*end[ \t]+sub[ \t]*([\r\n]|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*while[\s\(]/i.test(code)) {
		if (!/(^|[\r\n])[ \t]*wend(['\s]|$)/i.test(code))
			return true;
	}
	return false;
}

export function isLikelyChipmunkBasic(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;

	if (countRegexMatches(code, weakLikelyExpressions) > 1)
		return true;

	return false;
};