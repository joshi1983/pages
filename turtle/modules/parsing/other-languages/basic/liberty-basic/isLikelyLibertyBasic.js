import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	// indicators of Logo
	/(^|[\r\n])[ \t]*;/, // single line comment in some versions of Logo
	/(^|[\r\n])[ \t]*(fd|forward)[ \t]+\d+[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*(local)?make[ \t]+"[a-z_][a-z_\d]*[ \t]+/i,
	/(^|[\r\n])[ \t]*to[ \t]+[a-z_][a-z_\d]*\s+/i,

		// indicators of many other versions of BASIC
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(endif|next|subend)[ \t]*([\r\n']|$)/i,
		// Liberty Basic would use 'end if' instead of 'endif'.

		// From all the examples I saw, a variable name must follow the 'next' keyword.
		// The variable is optional in some other versions of Basic

		// indicators of Bazz Basic
	/(^|[\r\n])\s*def[ \t]+fn[ \t]+[a-z]/i,
	/(^|[\r\n])\s*screenlock[ \t]+(on|off)(\s|$)/i,
	/(^|[\r\n])\s*\[sub:[a-zA-Z_]+\]/,

	/(^|[\r\n])[ \t]*end[ \t]+while[ \t]*([\r\n']|$)/i,
	/(^|[\r\n])[ \t]*!/, // single line comment in some versions of Basic like HTBasic

	/(^|[\r\n])[ \t]*(gosub|go[ \t]*to)[ \t]+[a-z\d]/i,
		// Most other versions of basic use line numbers for labels.
		// Liberty Basic wraps labels in square brackets and uses identifier names including letters
		// based on the documentation I found.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?let[ \t]+[a-z_]+/i,
		// LET is a popular keyword in many versions of BASIC for assigning to variables.
		// I didn't see LET used in Liberty Basic examples I looked at, though.

		// indicator of QBasic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?screen[ \t]+\d+/i,

];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*open[ \t]+"[a-z_]+"[ \t]+for[ \t]+graphics(_[a-z]+)*[ \t]+as[ \t]+#/i,
	/(^|[\r\n])[ \t]*nomainwin[ \t]*([\r\n']|rem\s|$)/i,
		// no main window in Liberty Basic

	/(^|[\r\n])[ \t]*goto[ \t]+\[[a-z_]+\]/i,
		// for example goto [buttonEquals]
		// Bazz Basic might match this.

	/(^|[\r\n])[ \t]*gosub[ \t]+\[[a-z_]+\]/i,
		// for example gosub [buttonEquals]
		// Bazz Basic might match this.
];

const weakLikelyExpressions = [
	/(^|[\r\n])[ \t]*\[[a-z_]+\]/i, // a label declaration in Liberty Basic
	/(^|[\r\n])[ \t]*(button|menu)[ \t]+#/,
	/\s(gosub|GoTo)[ \t]*\[[a-z_]+\]/i,
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])[ \t]*for\s/i.test(code)) {
		// for-loops in Liberty Basic should always end with next variableName.
		if (!/\snext\s[a-z_]/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*function\s/i.test(code)) {
		// functions in Liberty Basic should always end with end function.
		if (!/\send[ \t]+function\s/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*if\s/i.test(code)) {
		// if-statements in Liberty Basic should always include a 'then' keyword.
		if (!/\sthen[\s']/i.test(code))
			return true;
	}
	if (/(^|[\r\n])[ \t]*while\s/i.test(code)) {
		// while-loops in Liberty Basic should always end with wend.
		if (!/\swend\s/i.test(code))
			return true;
	}
	return false;
}

export function isLikelyLibertyBasic(code) {
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