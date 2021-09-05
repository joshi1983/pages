import { countRegexMatches } from
'../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const unlikelyRegexes = [
	// indications of various versions of Logo:
	/(^|[\r\n])\s*(backward|forward|left|right)[ \t]+[:a-z\d-]/i,

	// indications of Python:
	/(^|[\r\n])import[ \t]+turtle/,
	/(^|[\r\n])from[ \t]+turtle[ \t]+import[ \t]*\*/,
	
	// indications of CodeHeart TurtleScript
	/(^|[\r\n])\s*(endFill|startFill)\s*\(\s*\)/
];
const likelyRegexes = [
	/(^|[\r\n])\s*def\s+[a-zA-Z_][a-zA-Z_\d]*\s*\([\s*a-zA-Z_][a-zA-Z_\d]*\s*:\s*(Boolean|Color|Double|Int|Picture|String|Unit)/,
		// for example, def f(x: Int
		// That would match in a lot of Scala programs.

	/(^|[\r\n])\s*(forward|left|right)\s*;/,
		// those commands are frequently used in various versions of Logo but a semicolon immediately after is
		// very unique to Kojo code.  Other logo code would have a parameter after.

	/(^|[\r\n])\s*val\s+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]/,
		// A variable declaration and initialization that is fairly unique to Scala and Kojo.

	/(^|[\r\n])\s*def\s+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]/,
		// something else fairly unique to Scala and Kojo

	/(^|[\r\n])\s*cleari\s*\(\s*\)/, // for example, cleari()

	/(^|[\r\n])\s*repeatFor\s*\(\s*\d+\s*to\s*/ // for example, repeatFor(4 to 10
];

const likelyRegexSets = [
	[/(^|[\r\n])\s*repeat\s*\(\s*\d+\s*\)\s*{/, /[\s;{](forward|left|right)[ \t]*[};]/]
		// The repeat pattern can happen in CodeHeart TurtleScript so it is combined with another
		// pattern that weakly indicates Kojo and would be very unlikely to happen in CodeHeart TurtleScript code.
];

const weakIndicators = [
	/(^|[\r\n])\s*\/\//, 
		// single-line comments.
		// That would match a lot of Kojo programs but also many other languages like c, c++, c#, Java, JavaScript, Processing...

	/(^|[\r\n])\s*hop[ \t]*[\r\n]\s*hop/,
		// not sure what the hop hop means but I found it in a few Kojo examples

	/(^|[\r\n])\s*setSpeed\s*\(fast\)/,
	/(^|[\r\n])\s*setPenThickness\s*\(/
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