import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	// some indicators of Logo
	/(^|[\r\n])[ \t]*repeat\s+\d+\s*\[/i,
	/(^|[\r\n])[ \t]*(home|pd|penup|pendown|pu)[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*to[ \t]+[a-z_.][a-z_.\d]*/i,

	/(^|[\r\n])[ \t]*\/\//,
		// a single line comment from various programming languages including
		// Java, c, c++, HolyC,... and JavaScript.

	// indicators of other versions of Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?'/,
		// commenting syntax supported by some versions of Basic

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?end[ \t]*if[ \t]*[\r\n]/i,
		// It looks like if-statements in Vintage Basic
		// are for single statements or lines.
		// Vintage Basic doesn't use endif, end if like many other Basic dialects.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(endwhile|wend)[ \t]*[\r\n]/i,
		// It looks like Vintage Basic does not support while-loops so
		// the usual keyword marking the end of a while-loop indicates 
		// the code is unlikely Vintage Basic.

	/\sgo[ \t]+to[ \t]+\d/i,
		// Vintage Basic supports goto but without a space between 'go' and 'to'.
		
	/[\s=+]INKEY\$[\s=+]/i,
		// QBasic and some other BASIC dialects support an inbuilt INKEY$ function.
		// Vintage BASIC does not appear to support it because
		// I couldn't find it mentioned at:
		// http://vintage-basic.net/downloads/Vintage_BASIC_Users_Guide.html

	// some indicators of AppleSoft Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?HOME[ \t]*[:\r\n]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?VTAB[ \t]+\d+[ \t]*[:\r\n]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?HPLOT[ \t]+[a-z\d]/i,

	// indicators of BBC Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?mode[ \t]+\d+[ \t]*[:\r\n]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?GCOL[ \t]+[a-z\d]+[ \t]*,/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?@%=\d+/i,

	// indicators of QBasic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?screen[ \t]+\d/i,
		// common in QBasic but not Vintage Basic
	/[\s\)]THEN[ \t]+END[ \t]*([\r\n]|$)/i,
		// Vintage Basic would likely use THEN STOP instead of THEN END.

	// indicators of Tektronix Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(INIT|PAGE)[ \t]*[:\r\n]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(VIEWPORT|WINDOW)[ \t]+-?\d+[ \t]*,/i,

];
const likelyExpressions = [
	/(^|[\r\n])[ \t]*\d+[ \t]*for[a-z]+=[-]?\d+to[\d\(]/i,

	/[ \t\)]THEN[ \t]+[1-9]\d*[ \t]*([\r\n]|$)/i,
		// This won't work in most versions of Basic.
		// It is an implied goto.
		// In other words, "then" followed by a label.
		// This might match some Tektronics Basic programs, unfortunately.
];

const weakLikelyExpressions = [
	/(^|[\r\n])[ \t]*\d+[ \t]*INPUT"/,
	// A lot of BASIC's support labels, input, and string literals starting with ".
	// The lack of a space between INPUT and the " is unusual for most BASIC code, though.
	// This might still match some BBC BASIC code.

	/(^|[\r\n])[ \t]*\d+[ \t]*\?"/,
		// ? is an alias for print in QBasic too.

	/(^|[\r\n])[ \t]*\d+[ \t]*for[a-z]+=[-]?\d+to[a-z\d \t\(]/i,
		// might match some BBC Basic code too.

	/(^|[\r\n])[ \t]*\d+[ \t]*next[a-z][ \t]*([\r\n]|$)/i,
		// no space between next and a variable name is fairly unique to Vintage Basic.
		// BBC Basic likely allows for that, though.
];

function isMissingPattern(code) {
	const thenFound = /\sthen\s/i.test(code);
	if (/(^|[\r\n])[ \t]*\d+[ \t]*IF[ \t\(]/i.test(code)) {
		if (!thenFound)
			return true;
	}
	if (thenFound) {
		// "then" keyword shouldn't be found unless a corresponding if statement is also found.
		if (!/[ \t\d]*IF[ \t\(]/i.test(code))
			return true;
	}
	return false;
}

export function isLikelyVintageBasic(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;

	if (isMissingPattern(code))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;

	if (countRegexMatches(code, weakLikelyExpressions) > 1)
		return true;

	return false;
};