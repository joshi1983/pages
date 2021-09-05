import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripJavaScriptComments } from
'./naiveStripJavaScriptComments.js';

const unlikelyPatterns = [
	// indicators of Logo
	/(^|[\r\n])\s*[a-z][ \t]+\d/i,
		// for example, forward 4, setPenSize 123

	// indicators of Basic
	/(^|[\r\n])\s*dim[ \t]+[a-z_][a-z\d]*/i,
	/(^|[\r\n])\s*end[ \t]+(function|if|sub)\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*next[ \t]+[a-z]\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*wend\s*([\r\n]|$)/i,

	/(^|[\r\n])\s*(char|double|float|int|I16|I32|I64|I8|U0|U16|U32|U64|U8|single|string|String)\s+[a-zA-Z_]/,
		// variable declaration in some more explicitly typed c-like languages like c, HolyC, Java

	/(^|[\r\n])\s*struct[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s*\{/,
		// Commonly found in c, c++, WGSL, and some other c-like languages.
		// JavaScript supports "class" but not "struct".

	// indicators of Haskell
	/(^|[\r\n])[ \t]*{-#/,
	/(^|[\r\n])[ \t]*main[ \t]*=[ \t]*(do\s*[\r\n]|print\s|putStrLn\s)/,

	// indicators of Ocaml
	/(^|[\r\n])\s*let\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	/(^|[\r\n])\s*let\s+\(\s*\)\s*=/,

	// indicators of PHP
	/(^|[\r\n])\s*<\?php/,
	/(^|[\r\n])\s*echo[ \t]+["\$a-zA-Z_]/,
	/(^|[\r\n])\s*\?>/,

	// indicators of Python
	/(^|[\r\n])\s*import\s+turtle\s/,
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import\s+/,
	/(^|[\r\n])\s*def\s+[a-zA-Z_]/,
	/(^|[\r\n])\s*for[ \t]+[a-zA-Z_][ \t]+in[ \t]+/,

	/(^|[\r\n])\s*(let|var)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*:[ \t]*\[*[a-zA-Z_]/,
		// this pattern would match some variable declarations in Swift.
		// for example, let x: Double
		// let x: [Any]
		// JavaScript doesn't expect data types to be specified like that.
		
	// indicators of Rust
	/(^|[\r\n])\s*(pub[ \t]+)?fn[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,

	// indicators of WSGL
	/(^|[\r\n])\s*@(builtin|location)\(/,
	/(^|[\r\n])\s*@(fragment|vertex)\s/,
];

const likelyPatterns = [
	/(^|[\r\n])[ \t]*import\s*\{\s*[a-zA-Z_][a-zA-Z_\d]*(,\s*[a-zA-Z_][a-zA-Z_\d]*\s*)*\s*\}\s*from\s/,
	/(^|[\r\n])[ \t]*function\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	/(^|[\r\n])[ \t]*console[ \t]*.[ \t]*log\s*\(/,
	/(^|[\r\n])[ \t]*(const|let|var)\s+[a-zA-Z_][a-zA-Z_\d]*\s*=[^=]/,
	/(^|[\r\n])[ \t]*document\s*.\s*[a-z][a-zA-Z\d]*[ \t]*\(/
];

const weakPatterns = [
	/(^|[\r\n])[ \t]*\/\//,
	/(^|[\r\n])[ \t]*goto[ \t]*\([ \t]*-?\d+[ \t]*,[ \t]*-?\d+[ \t]*\)/,
	/Math\s*.\s*[a-z][a-z\d]*[ \t]*\(/,
	/(^|[\r\n])[ \t]*(var|let)\s+[a-zA-Z_][a-zA-Z_\d]*\s*;/,
];

export function isLikelyJavaScript(code) {
	const strippedCode = naiveStripJavaScriptComments(code);
	if (matchesARegex(unlikelyPatterns, strippedCode))
		return false;

	if (matchesARegex(likelyPatterns, strippedCode))
		return true;

	if (countRegexMatches(code, weakPatterns) >= 2)
		return true;

	return false;
};