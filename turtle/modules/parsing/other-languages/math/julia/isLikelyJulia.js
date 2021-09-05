import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Logo
	/(^|[\r\n])\s*(backward|fd|forward|left|print|right)[ \t]+-?\d/i,

	/(^|[\r\n])[ \t]*--/,
		// comments in Haskell, Lua, and Ada
	
	/(^|[\r\n])[ \t]*\/\//,
		// comments in many c-like languages such as c, c++, HolyC, Java, JavaScript, PHP

	/(^|[\r\n])[ \t]*%/,
		// single line comments in MatLab and Turing

	/(^|[\r\n])[ \t]*(def|fn|func)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// indicators of function definitions from some other programming languages like Python, Rust.

	/(^|[\r\n])[ \t]*else[ \t]+if\s/i, // MatLab would use elseif instead of including a space.
	/(^|[\r\n])[ \t]*els?if\s/i,

	// indicators of Basic
	/(^|[\r\n])[ \t]*REM\s/i, // BASIC single line comments
	/(^|[\r\n])[ \t]*sub[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// BASIC subroutine definition

	/(^|[\r\n])[ \t]*end[ \t]+(function|if|while)(\s|$)/i,
	/(^|[\r\n])[ \t]*wend[ \t]*([\r\n]|$)/i,
	
	// indicators of Python
	/(^|[\r\n])[ \t]*import[ \t]+turtle\s/,
	/(^|[\r\n])[ \t]*from[ \t]+turtle[ \t]+import[*\s]/,
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*for[ \t]+[a-z]+[ \t]+in[ \t]+(\d+[ \t]*:|sort[ \t]*\()/,
		// for example, for k in sort(collect(keys(d1)))
		// also: for i in 1:5
	
	/(^|[\r\n])[ \t]*for[ \t]*\([ \t]*[a-z]+[ \t]*,[ \t]*[a-z]+[ \t]*\)[ \t]*in[ \t]+enumerate[ \t]*\(/,
		// for example, for (i, v) in enumerate(a3)

	/(^|[\r\n])[ \t]*function[ \t]+[a-z_][a-z_\d]*[ \t]*\([ \t]*[a-z_][a-z_\d]*[ \t]*::[ \t]*(Bool|Float(16|32|64)|(Int|UInt)(128|16|32|64|8))/,
	
	/(^|[\r\n])[ \t]*mutable[ \t]+struct[ \t]+[a-zA-Z_][a-z_\d]*/,

	/(^|[\r\n])[ \t]*@printf[ \t]+"/,
	/(^|[\r\n])\s*using[ \t]+(Calculus|Plots|Printf)\s*([\r\n]|$)/
];

const weakLikelyRegexes = [
	/(^|[\r\n])[ \t]*#/, // single line comments in Julia
	/(^|[\r\n])\s*elseif[ \t]+[a-zA-Z_\d]/,
	/(^|[\r\n])[ \t]*for[ \t]+[a-z_][a-z_\d]*[ \t]+in[ \t]+/,
	/(^|[\r\n])[ \t]*function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*println\(/,
	/(^|[\r\n])\s*using[ \t]+[A-Z][a-z]+\s*([\r\n]|$)/
];

function hasMissingPattern(code) {
	const isEndFound = /\send(\s|$)/.test(code);
	if (/(^|[\r\n])\s*(else|elseif|for|function|if|while)[ \t]/.test(code) ||
	/(^|[\r\n])\s*begin\s/.test(code)) {
		// begin, for, function, if, while are ended with the "end" keyword in Julia.
		if (!isEndFound)
			return true;
	}
	return false;
}

export function isLikelyJulia(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};