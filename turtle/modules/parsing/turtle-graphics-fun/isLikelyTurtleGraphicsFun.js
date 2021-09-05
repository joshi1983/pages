import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments as webLogoCodeNaiveStripComments } from
'../naiveStripComments.js';
import { StringBuffer } from
'../../StringBuffer.js';

const unlikelyExpressions = [
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
		// Turtle Graphics Fun is JavaScript but the Turtle Graphics Fun examples I found don't use import statements.
];
const funRegexes = [
	/(^|[\r\n])\s*angle[ \t]*\(/,
	/(^|[\r\n])\s*(hideturtle|hideTurtle|reset)[ \t]*\([ \t]*\)/,
	/(^|[\r\n])\s*repeat[ \t]*\(\s*\d+\s*,\s*function/
];

// This should remove both single-line comments( // ) and multiline comments(/* ... */).
// This is "naive" or unreliable in some cases, though.
// This will not properly handle // and /*  or */ from within
// string literals. It also won't properly handle them when those patterns are within other comments.
// This should be correct often enough to be useful for this isLikelyTurtleGraphicsFun module, though.
function naiveStripComments(code) {
	/* I tried 	return code.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '');
	but that didn't always work correctly.
	For example, '// hi\n/* comment*\/'.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '')
	returned '* comment *\/' when it should return an empty string.
	*/
	const result = new StringBuffer();
	for (let i = 0; i < code.length; i++) {
		if (code.startsWith('//', i)) {
			const endIndex = code.indexOf('\n', i);
			if (endIndex === -1)
				break;
			else
				i = endIndex - 1;
		}
		else if (code.startsWith('/*', i)) {
			const endIndex = code.indexOf('*/', i);
			if (endIndex === -1)
				break;
			else
				i = endIndex + 1;
		}
		else
			result.append(code[i]);
	}
	return result.toString();
}

export function isLikelyTurtleGraphicsFun(code) {
	const code1 = naiveStripComments(webLogoCodeNaiveStripComments(code));
	if (matchesARegex(unlikelyExpressions, code1))
		return false;
	const code2 = naiveStripComments(code);
	if (matchesARegex(funRegexes, code2))
		return true;
	return false;
};