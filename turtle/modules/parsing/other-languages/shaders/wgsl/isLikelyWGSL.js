import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Gleam
	/(^|[\r\n])\s*import[ \t]+(gleam|gleeunit)[ \t]*([\r\n]|\/[ \t]*[a-z_])/,

	/(^|[\r\n])\s*(def|double|float|func|function|int|void)[ \t]+[a-zA-Z_][a-zA-Z_\d][ \t]*\(/,
		// function definitions from a few other languages like JavaScript, c, c++, Python
		// WSGL uses "fn" instead of these other keywords or return data types.

	/(^|[\r\n])\s*impl[ \t]+[a-zA-Z]/,
		// matches some Rust code.
		// I couldn't find any "impl" keyword in WSGL.

	/(^|[\r\n])\s*let[ \t]+mut[ \t]+[a-zA-Z_]/,
		// matches some Rust code.
		// I couldn't find any "let mut varName" examples in WSGL documentation I looked at.

	/(^|[\r\n])\s*use[ \t]+turtle[ \t]*::/
		// matches some Rust code using turtle graphics
];

const likelyRegexes = [
	/(^|[\r\n])\s*fn[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(\s*@(builtin|location)[ \t]*\(/,
	/(^|[\r\n])\s*fn[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s*\(\s*\)\s*->/ 
		// might match some Gleam programs
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*fn[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// For example, fn main(
		// This can be matched in Gleam and Rust programs too.
	
	/(^|[\r\n])\s*(let|var)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*(f16|f32|i32|u32)[ \t]*=/,
	/(^|[\r\n])\s*@(fragment|vertex)\s/,
	/(^|[\r\n])\s*@builtin\(/,
	/(^|[\r\n])\s*@compute\s/,
	/(^|[\r\n])\s*@location\([ \t]*\d[ \t]*\)/,
];

export function isLikelyWGSL(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};