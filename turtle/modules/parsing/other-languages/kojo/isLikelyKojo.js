import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const unlikelyRegexes = [
	// indications of various versions of Logo:
	/(^|[\r\n])\s*(backward|forward|left|right)[ \t]+[:a-z\d-]/i,

	// indicators of Groovy:
	/(^|[\r\n])\s*(class|enum)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*{/,
		// for example, class A {
		// Scala and Groovy would expect a : instead of {.

	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(\s*[a-zA-Z_][a-zA-Z_\d]*\s+[a-zA-Z_][a-zA-Z_\d]*/,
		// for example, def p(int x
		// Kojo and Scala would expect a colon between the int and x.

	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*(\d|new\s[a-zA-Z_])/,
		// for example def x = 3
		// or def y = new StringWriter
		// Kojo has something similar but not quite the same.
		//
		// Kojo can define functions like def x = { // some implementation.
		// In Kojo, you can also have: var x = 3
		// or val x = 3
		// From what I can find, def x = 2 would be invalid in Kojo.

	/[a-zA-Z_][ \t]*.[ \t]*rcurry[ \t]*\(/,

	// indicators of JavaScript
	/(^|[\r\n])\s*function\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,

	// indications of Python:
	/(^|[\r\n])import[ \t]+turtle/,
	/(^|[\r\n])from[ \t]+turtle[ \t]+import[ \t]*\*/,
	/(^|[\r\n])+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\[/,
		// for example x = [1,2]
		// Kojo doesn't allow array or list literals starting with square brackets like that.
		// Kojo would have code like x = List(1,2).

	// indications of CodeHeart TurtleScript
	/(^|[\r\n])\s*(endFill|startFill)\s*\(\s*\)/
];
const likelyRegexes = [
	/(^|[\r\n])\s*animate[ \t]*{/,

	/(^|[\r\n])\s*def\s+[a-zA-Z_][a-zA-Z_\d]*\s*\([\s*a-zA-Z_][a-zA-Z_\d]*\s*:\s*(Boolean|Color|Double|Int|Picture|String|Unit)/,
		// for example, def f(x: Int
		// That would match in a lot of Scala programs.

	/(^|[\r\n])\s*(forward|left|right)[ \t]*;/,
		// those commands are frequently used in various versions of Logo but a semicolon immediately after is
		// very unique to Kojo code.  Other logo code would have a parameter after.

	/(^|[\r\n])\s*hop[ \t]*[\r\n]\s*hop/,
		// some examples found on Kojo Exchange call hop more than once.

	/(^|[\r\n])\s*def\s+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]/,
		// something else fairly unique to Groovy, Scala and Kojo

	/(^|[\r\n])\s*cleari\s*\(\s*\)/, // for example, cleari()

	/(^|[\r\n])\s*repeatFor\s*\(\s*\d+\s+to\s+/, // for example, repeatFor(4 to 10
	
	/(^|[\r\n])\s*setPenFont[ \t]*\([ \t]*Font[ \t]*\(/,
	/(^|[\r\n])\s*setPenFontSize\(\s*\d+\s*\)/,
	/(^|[\r\n])\s*setSpeed[ \t]*\([ \t]*superFast[ \t]*\)/,
	
	/(^|[\r\n])\s*(setBackgroundColor|setFillColor|setPenColor)[ \t]*\([ \t]*[cC]olor[ \t]*\([ \t]*\d+[ \t]*,/
];

const likelyRegexSets = [
	[/(^|[\r\n])\s*repeat\s*\([^\)]+\)\s*{/, /[\s;{](forward|left|right)[ \t]*[};]/],
		// The repeat pattern can happen in CodeHeart TurtleScript so it is combined with another
		// pattern that weakly indicates Kojo and would be very unlikely to happen in CodeHeart TurtleScript code.

	[/(^|[\r\n])\s*repeat\s*\([^\)]+\)\s*{/, /[\s;{](left|right)[ \t]*\(\s*\d+\s*./],
		// again, repeat pattern can happen in CodeHeart TurtleScript so it is combined with another pattern.
		// A call to right or left with more than 1 actual parameter should be rare in other languages and libraries.
		// right or left with 2 parameters corresponds with arcRight and arcLeft in WebLogo.
	
	[/(^|[\r\n])\s*class[ \t]+[a-zA-Z_]/, /\)[ \t]*{/, /:[ \t]*(Byte|Double|Float|Int|Long|Short)/]
		// A few fairly weak indicators of Scala
		// that is a pretty strong indicator if all of them are found in the same code.
];

const weakIndicators = [
	/(^|[\r\n])\s*\/\//, 
		// single-line comments.
		// That would match a lot of Kojo programs but also many other languages like c, c++, c#, Java, JavaScript, Processing...

	/(^|[\r\n])\s*hop[ \t]*\(\s*-?\d/,
		// hop is fairly unique to Kojo

	/(^|[\r\n])\s*repeat\s*\(\s*[^\)]+\)\s*{/,
	/(^|[\r\n])\s*(setBackground|setFillColor)\(\s*(cm|[cC]olor|ColorMaker)\s*\.\s*[a-z]+\s*\)/,
	/(^|[\r\n])\s*setPenColor\(\s*(cm|[cC]olor|ColorMaker)\s*\.\s*[a-z]+\s*\)/,
	/(^|[\r\n])\s*setSetPenFontSize\(\s*\d+/,
	/(^|[\r\n])\s*setPenFont[ \t]*\(/,
	/(^|[\r\n])\s*setSpeed[ \t]*\([ \t]*(medium|fast)[ \t]*\)/,
	/(^|[\r\n])\s*setPenThickness[ \t]*\(/,
	/(^|[\r\n])\s*val\s+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]/,
		// A variable declaration and initialization that is fairly unique to Scala, Kotlin and Kojo.
];

export function isLikelyKojo(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	if (countRegexMatches(code, weakIndicators) > 2)
		return true;
	if (matchesARegexSet(likelyRegexSets, code))
		return true;
	return false;
};