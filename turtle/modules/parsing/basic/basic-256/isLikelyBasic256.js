import { ArrayUtils } from
'../../../ArrayUtils.js';
import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';

const unlikelyExpressions = [
	/(^|[\r\n])[ \t]*#autostart[ \t]+\d+/i,
	/(^|[\r\n])[ \t]*#timeout[ \t]*[\t =]\d/,
	/(^|[\r\n])[ \t]*import[ \t]+/i, // used in Python and Processing
	/(^|[\r\n])[ \t]*from[ \t]+turtle/i, // used in Python
	/(^|[\r\n])[ \t]*#include[ \t]+/i,
	/(^|[\r\n])[ \t]*\/\//, // single line comment found in many other programming languages including:
		// c, c++, JavaScript, Processing...
		// The comment you're reading is an example.

	/(^|[\r\n])[ \t]*def[ \t]+[a-zA-Z_]/,

	/(^|[\r\n])[ \t]*describe[ \t]+[a-z][a-z_\d]*@/i,
		// a pattern from Basil Basic

	/(^|[\r\n])[ \t]*}[ \t]*else[ \t]*{/i,
	/(^|[\r\n])[ \t]*end[ \t]+(func|if|sub)\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*for[ \t]+each\s+/i,

	/(^|[\r\n])[ \t]*(fd|forward)[ \t]+\d+/,

	// some indicators of KTurtle
	/(^|[\r\n])[ \t]*kturtle-script-v/,
	/(^|[\r\n])[ \t]*learn[ \t]+[a-z]/i,
	/(^|[\r\n])[ \t]*\$/, // KTurtle's variable references sometimes start with $.
	/(^|[\r\n])[ \t]*REPEAT[ \t]+\d+\s*[\r\n\[{]/i,
		// The [ and { are also in the end of the pattern to match some common patterns from Logo.

	/(^|[\r\n])[ \t]*PRINTLN[ \t]+/i, // frequently found in some BASIC dialects

	/(^|[\r\n])[ \t]*to[ \t]+[a-z]/i,
		// indicator of various versions of Logo.
		// 'to' usually starts the definition of a procedure.

	/(^|[\r\n])[ \t]*wend\s*([\r\n]|$)/i,
		// Basic 256 uses 'end while' instead of wend.
		// wend is frequently used in a lot of other Basic dialects.
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*end[ \t]+while([\s:]|$)/i,
];

const likelyBasicExpressions = [
	/(^|[\r\n])[ \t]*circle[ \t]+(\d+[ \t]*,[ \t]*){2}\d+\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*(dim|redim)[ \t][a-z_][a-z_\d]*[@#\$%]?/i,
	/(^|[\r\n])[ \t]*(function|subroutine)[ \t]+[a-z_][a-z_\d]*[@#%\$]?[ \t]*\(/i,
	/[\s,=]INPUT$[ \t]*\(/i,
	/(^|[\r\n])[ \t]*NEXT[ \t]+[a-z_][a-z_\d]*/i,
	/(^|[\r\n])[ \t]*rect[ \t]+(\d+[ \t]*,[ \t]*){3}\d+\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*REM[\s\(\[]/i,
];

const weakAndBasicExpressions = [
	/(^|[\r\n])[ \t]*clg\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*colo[u]?r[ \t]+rgb[ \t]*\(([ \t]*\d+[ \t]*,){2}[ \t]*\d+/i,
	/(^|[\r\n])[ \t]*colo[u]?r[ \t]+(black|blue|darkblue|darkcyan|darkyellow|green|grey|orange|red|white|yellow)([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*end[ \t]+(function|subroutine|try)\s*([\r\n]|$)/i,
];

const weakExpressions = [
	/(^|[\r\n])[ \t]*#/, // single line comments in Basic 256
		// # is also found in Python, c, c++, KTurtle so this pattern needs to be combined with some
		// other patterns that eliminate code from those other languages.
		// Since this # pattern will match several other languages,
		// it is being used in combination with some other Basic 256 patterns to reduce false detections.
];
ArrayUtils.pushAll(weakExpressions, weakAndBasicExpressions);
ArrayUtils.pushAll(likelyBasicExpressions, weakAndBasicExpressions);

function hasMissingPatterns(code) {
	if (/(^|[\r\n])[ \t]*if\s/i.test(code) &&
	/\sthen\s/i.test(code) === false)
		return true; // all if-statements in BASIC 256 have 'then' keywords.
		// Return true indicating the code is unlikely to be BASIC 256.
	return false;
}

export function isLikelyBasic256(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (hasMissingPatterns(code))
		return false;
	if (matchesARegex(likelyExpressions, trimmedCode))
		return true;
	if (matchesARegex(likelyBasicExpressions, code)) {
		if (countRegexMatches(code, weakExpressions) >= 2)
			return true;
	}
	return false;
};