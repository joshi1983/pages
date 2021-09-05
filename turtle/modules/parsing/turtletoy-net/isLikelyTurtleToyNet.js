import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	// indicators of Python
	/(^|[\r\n])\s*from[ \t]+turtle[ \t]+import[ \t]*\*/,

	// indicators of WebLogo and some other dialects of Logo:
	/(^|[\r\n])\s*repeat\s+\d+\s*\[/i,
		// matches start of repeat-loops in Logo
	/(^|[\r\n])\s*(back|backward|fd|forward|setPenSize)[ \t]+-?(\d+|:[a-z_][a-z_\d]*)(\s|$)/i,
		// matches calls to a few common Logo commands that take numeric first parameters
	/(^|[\r\n])\s*to[ \t]+[a-z_][a-z_\d]*\s/i,
		// procedure definitions

	/(^|[\r\n])\s*(def|func|sub)[ \t]+[a-z_][a-z_\d]*\s*\(/,
		// function definitions from languages like Basic, Python and Go

	/(^|[\r\n])\s*#/, 
		// single-line comments from languages like Python
		// also, preprocessor directives from languages like c, c++, HolyC..
	/(^|[\r\n])\s*import\s/, // import statements from languages like JavaScript(ECMAScript 6 and later) and Python
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*const[ \t]+turtle[ \t]*=[ \t]*new[ \t]+Turtle\(\);/,
	/(^|[\r\n])[ \t]*Canvas[ \t]*\.[ \t]*setpenopacity[ \t]*\(/
];

export function isLikelyTurtleToyNet(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};