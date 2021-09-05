import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { countRegexSetMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexSetMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indicators of WebLogo:
	/(^|[\r\n])\s*to [a-z_][a-z_\d]*/i,
	/(^|[\r\n])\s*(back|backward|forward|jumpForward|left|right)[ \t]+(\d+|[a-z_][a-z_\d]*)/i,
	/(^|[\r\n])\s*repeat[ \t]+(\d+|[a-z_][a-z_\d]*)\s*\[/i,

	/(^|[\r\n])[\sa-z]*:=[\sa-z]/i, // used in Go
	/(^|[\r\n])import\s/, // used in Python, Go and some other languages.

	/(^|[\r\n])\s*for[ \t]+\(/i,
		// frequently used in other languages like c, c++, Java, JavaScript, Kojo, Scala
		// pBasic's for-loops always have an identifier immediately after the "for" keyword.

	/(^|[\r\n])\s*go[ \t]*to[ \t]+[a-z_\d]/i,
		// pBasic does not support goto or go to statements.

	/(^|[\r\n])\s*if[ \t]+[a-z_][a-z_\d]*[ \t]*=[ \t\d]/i,
		// pBasic uses == for comparison instead of = like most other dialects of BASIC.

	/(^|[\r\n])\s*else\s/i,
		// pBasic does not support else according to its pScript ReadMe.txt file.

	/(^|[\r\n])\s*rem[ \t]+/i,
		// used for comments in many other dialects of BASIC but
		// couldn't find any REM comments in the examples of pBasic that I could find.

	/(^|[\r\n])\s*wend\s/i,
		// pBasic uses {} instead of wend to mark the end of a while-loop's code block.

	/(^|[\r\n])while\s*\([a-z_][a-z_\d]*\s*=\s*\d+\)/i,
		// unlikely because pBasic would use == instead of = here.

	/(^|[\r\n])while\s*[^\(\/\s]/i,
		// unlikely because pBasic would use ( before a while-statement's condition
];

const likelyExpressions = [
	/(^|[\r\n])\s*BUFFER[ \t]*:[ \t]*\d+/i, 
	/(^|[\r\n])\s*TIMER[ \t]+\d.\d+[ \t]+[a-z_]/i, 
		// of the format: timer interval callbackFunction.
		// for example: TIMER 0.25 tickFunc

	/(^|[\r\n])\s*(timeroff|timeron|timerstop)(\s|$)/i,
	/(^|[\r\n])\s*SPRITE[ \t]*\([ \t]*\d+/i,

	/(^|[\r\n])\s*var[ \t]+[a-z_][a-z_\d]*[\$]?[ \t]*(\[[ \t]*\d+[ \t]*\][ \t]*)?:[ \t]*(Bool|Float|Int|String)/i,
		// for example, var mx[12]       : Float
		// var b3vy : Float = 0.0
];

const weakExpressions = [
	/(^|[\r\n])\s*\/\//, 
		// single-line comments.
		// That would match a lot of pBasic programs but also many other languages like 
		// c, c++, c#, Java, JavaScript, Kojo, Processing...

	/(^|[\r\n])\s*BUFFER[ \t]*[\r\n]/i, // swap buffers
	/(^|[\r\n])\s*BUFFER[ \t]*\([ \t]*\d[ \t]*,[ \t]*\d[ \t]*\)/i,

	/(^|[\r\n])\s*func[ \t]+[a-z_][a-z_\d]*[$]?[ \t]*\(\s*([a-z_][a-z_\d]*[$]?)?\s*\)[ \t]*{/i,
		// for example, func gameLoop() {

	/(^|[\r\n])\s*if\s+[a-z_][a-z_\d]*[$]?\s*([><]|==|<=|>=|<>)\s*(d+|[a-z_][a-z_\d]*[\$]?)\s+then\s+(y\s*=[\s\d]|[a-z_][a-z_\d]*\s*\(\s*\))/i,
		// for example, if x > 0 then y = 1
		// or if x > 0 then f()

	/(^|[\r\n])\s*pen[ \t]+\d+(.\d*)?/i, // setting pen size

	/(^|[\r\n])\s*var[ \t]+[a-z_][a-z_\d]*\$[ \t]*=[ \t]*"/i
];

const weakSetExpressions = [
	[/(^|[\r\n])\s*for[ \t]+[a-z_][a-z_\d]*[ \t]*=/i, /(^|[\r\n])\s*next[ \t]+[a-z_][a-z_\d]*[ \t]*[\r\n]/i]
];

export function isLikelyPBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;

	if (matchesARegex(likelyExpressions, stripBASICCommentsAndEmptyStringLiterals(code)))
		return true;
	if (countRegexMatches(code, weakExpressions) + countRegexSetMatches(code, weakSetExpressions) >= 2)
		return true;
	return false;
};