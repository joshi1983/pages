import { ArrayUtils } from
'../../../ArrayUtils.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// MicroA if-statements do not have a "then" keyword unlike many other BASIC dialects.
	/(^|[\r\n])[ \t]*if[ \t]+([a-z]+|\d+)[ \t]+then\s/i,

	// indicators of WebLogo and some other Logo dialects
	/(^|[\r\n])[ \t]*(local)?make[ \t]+"([a-z]+|\d+)\s/i,
	/(^|[\r\n])[ \t]*(repeat|rpt)\s+\d+\s*\[/i,
];

// These patterns should be very unlikely to match comments and contents of string literals.
// Most of these start by matching the beginning of a line because string literals and comments
// don't span multiple lines in Micro(A) BASIC and many other BASIC dialects.
const likelyExpressions = [
	/(^|[\r\n])[ \t]*([bfw]color)[ \t]+(\d{1,3}|[a-z]+)[ \t]*,[ \t]*(\d{1,3}|[a-z]+)[ \t]*,[ \t]*(\d{1,3}|[a-z]+)[ \t]*([\r\n:]|$)/i, 
	// for example, fcolor 200,200,240
	/(^|[\r\n])[ \t]*label[ \t]+[a-z]+[ \t]*([\r\n:]|$)/i, // for example, label gameover
	/(^|[\r\n])[ \t]*LoadImg[ \t]+[a-z]+[ \t]*,/i,
	/(^|[\r\n])[ \t]*hWparam[ \t]+[a-zA-Z]+[ \t]*[\r\n]/,
	/(^|[\r\n])[ \t]*swap[ \t]*[\r\n:]/i
];

// indicators that are strong enough to justify the cost of scanning the code as a BASIC dialect.
const likelyBASICExpressions = [
	/(^|[\r\n])[ \t]*WinMsg[ \t]+wm/,
	/(^|[\r\n])[ \t]*(endfn|endif|EndWm|wend)[ \t]*([\r\n:]|$)/i,
	/(^|[\r\n])[ \t]*func[ \t]+[a-z]+[ \t]*\(/i // for example, func drawStars(
];

// indicators that differentiate Micro A from other BASIC dialects
// and require the removal of BASIC-style comments and emptying of string literals to be reliable.
const likelyMicroABASICExpressions = [
	/:[ \t]*swap[ \t]*[\r\n:]/i,
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyMicroABASICExpressions);

export function isLikelyMicroABasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, trimmedCode))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(likelyMicroABASICExpressions, basicCode))
			return true;
	}
	return false;
};