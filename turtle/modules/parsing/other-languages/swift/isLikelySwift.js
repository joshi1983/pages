import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Logo
	/(^|[\r\n])\s*repeat[ \t]+\d+[ \t]*\[/i,

	// indicators of Logo and some other languages
	/(^|[\r\n])\s*for[ \t]+[\(\[]/,
		// common to Logo, JavaScript, c, and many other programming languages.

	// indicators of Basic
	/(^|[\r\n])\s*func[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\([ \t]*[a-zA-Z_][a-zA-Z_\d]+[ \t]*,/i,
		// for example, func f(x,
		// indication of pBasic
		// Swift would indicate a data type for the first parameter.

	/(^|[\r\n])\s*locate[ \t]+\d+[ \t]*,[ \t]*\d+/i,
	/(^|[\r\n])\s*next[ \t]+[a-zA-Z_][a-zA-Z_\d]*/i,
		// For example, next x
		// matches many dialects of Basic
		// "next" usually marks the end of for-loops in Basic.

	/(^|[\r\n])\s*print[ \t]+[:a-zA-Z_\d"]/,
		// no ( is needed for parameters in Logo, Basic, 
		// and some other languages when using print.
		// Python 1 and 2 print-statements were often without ( brackets around parameters too.

	/(^|[\r\n])\s*(def|function)[ \t]+[a-zA-Z_][ \t]*\(/,
		// matches function definitions in JavaScript and Python

	// indicators of Python
	/(^|[\r\n])\s*#/,
	/(^|[\r\n])\s*import[ \t]+turtle[ \t]/,
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import[ \t]/,
];
const repeatStartPattern = /(^|[\r\n])\s*repeat[ \t]*\{/;

const likelyRegexes = [
	/(^|[\r\n])\s*@objc[\s\(]/,
	/(^|[\r\n])\s*(extension|protocol)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\{/,
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+in[ \t]+-?\d+[ \t]*..[.<]-?\d+/,
	/(^|[\r\n])\s*(let|var)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*(Bool|Double|Int|Int8|String|UInt|UInt16|UInt8)\??/,
	repeatStartPattern,
	/(^|[\r\n])\s*typealias[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*(Bool|Double|Int|Int8|String|UInt|UInt16|UInt8)\??/
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*@available[ \t]*\(/,
	/(^|[\r\n])\s*defer[ \t]*\{/,
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+in[ \t]+-?(\d+|[a-zA-Z_][a-zA-Z_\d]*)[ \t]*..[.<]/,
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+in[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\{/,
	/(^|[\r\n])\s*func[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*(let|var)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*\[*[a-zA-Z_]/,
	/(^|[\r\n])\s*typealias[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*[a-zA-Z_][a-zA-Z_\d]*/,
];

function containsInvalidPatternCombination(code) {
	if (repeatStartPattern.test(code)) {
		// repeat loops in Swift should be ended with a while.
		if (!/\}\s*while\s/.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*case\s/.test(code)) {
		// in Swift, case keyword is always used in a switch.
		if (!/\sswitch\s/.test(code))
			return true;
	}
	return false;
}

export function isLikelySwift(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (containsInvalidPatternCombination(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};