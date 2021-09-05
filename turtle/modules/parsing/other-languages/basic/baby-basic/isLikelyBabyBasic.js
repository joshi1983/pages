import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const unlikelyExpressions = [
	// Small Visual Basic indicators
	/(^|[\r\n])[ \t]*Turtle.(DirectMove|DirectTurn|Hide|PenDown|PenUp)\(/,

	/(^|[\r\n])[ \t]*end[ \t]+(func|if|sub)\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*for[ \t]+each\s+/i,

	/(^|[\r\n])[ \t]*to[ \t]+[a-z]/i,
		// indicator of various versions of Logo.
		// 'to' usually starts the definition of a procedure.

	// indicators of other BASIC dialects
	/(^|[\r\n])[ \t]*next[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*next[ \t]*[a-z_]/i,
		// Baby Basic uses EndFor instead of next.
	/(^|[\r\n])[ \t]*wend\s*([\r\n]|$)/i,
		// Baby Basic uses 'endWhile' instead of wend.
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*Number[ \t]+[a-zA-Z_]+[ \t]*=[ \t]*/,
	/(^|[\r\n])[ \t]*Window\.(DrawSolidRectangle|SetBrushColor|SetGameBackground|SetLineDash)\(/,
];

const babyBasicSets = [
	[/(^|[\r\n])\s*for\s/i,
		/[ \t]To[ \t]/i,
		/(^|[\r\n])\s*endFor\s*[\r\n]/i
	]
];

function hasMissingPatterns(code) {
	if (/(^|[\r\n])[ \t]*loop\s/i.test(code) &&
	!/\send[ \t]+loop(\s|$)/i.test(code))
		return true; // all loop statements in Baby BASIC are ended with end loop.

	if (/(^|[\r\n])[ \t]*for\s/i.test(code) &&
	!/\sendFor(\s|$)/i.test(code))
		return true; // all for-loops in Baby BASIC are ended with endfor.

	if (/(^|[\r\n])[ \t]*if\s/i.test(code) &&
	(!/\sthen\s/i.test(code) ||
	!/\sendIf\s/i.test(code)))
		return true; // all if statements in Baby BASIC contain "then" and are ended with endIf.
		
	return false;
}

export function isLikelyBabyBasic(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;
	if (hasMissingPatterns(code))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegexSet(babyBasicSets, code))
		return true;
	return false;
};