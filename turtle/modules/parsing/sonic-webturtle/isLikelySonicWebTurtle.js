import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from '../naiveStripComments.js';

const antiExpressions = [
// indicators of other versions of Logo:
/(^|\s)(fd|forward)\s+/i,
// fd and forward is very common in most Logo variants.
// "draw" or "move" commands are used instead in Sonic WebTurtle.

/(^|\s)(setpc|setpencolor|setpenwidth|setpensize)\s+/i,
/(^|\s)make\s+\"/i,
/(^|\s)for\s*\[/i,
/(^|\s)repeat\s+\d+\s*\[/i, // Sonic WebTurtle supports repeat but it doesn't include the square brackets.
/(^|\s)ifelse\s+/i,

// a couple indications of KTurtle scripts
/^kturtle-script-v/,
/(^|\s)learn\s+[a-zA-Z]/,
/(^|\s)\$[a-z_]+[0-9a-z_]*\s*=/i,

// indicators of c, c++, Java, and Processing languages
/(^|\s)(boolean|byte|char|double|float|int)\s+[\w\W+_]+\s*/,
// a statically-typed declaration like int gridSize
/(^|\s)(byte|char|double|float|int)\s+[\w\W+_]+\s*\=\s*\d+/,
// a statically-typed declaration and initialization like int gridSize = 123
/(^|\s)void\s+[\w\W_]+\s*\(\s*\)\s*\{/,

// some indications of Python code using turtle packages.
/(^|\s)from\s+turtle\s+import/,
/(^|\s)import\s+turtle\s/,

// some indicators of Osmosian plain English
/(^|\n)to([ \t]+[a-z]+)+:\r?\n/i,

// indicators of BBC Basic
/(\s|^)endproc(\s|$)/i,
/(\s|^)mode\s+[1-9]+(\s|$)/i,
/\sthen\s+[1-9]+/i,

// indicators of Micro(A) Basic
/([\r\n]|^)[a-z_]+[ \t]*=[ \t]*\d+[ \t]*[\r\n:]/i, 
	// Sonic WebTurtle assigns values to variables in a different way.
	// It would be rare to compare a variable with a number on a line in Sonic WebTurtle

/([\r\n]|^)[ \t]*[a-z]+[ \t]+[a-z_0-9]+[ \t]*,/i,
	// for example, var x,
	// let x,
	// print 3,
	// This pattern will match a lot of non Sonic WebTurtle languages including JavaScript, various versions of Basic...
	// The comma is not used much in Sonic WebTurtle.

// indicator of the Go programming language
/(\s|^)func[ \t]+[a-z_]+[ \t]*\(/i,

// some indicators of Small Visual Basic
/(^|\s)(Colors|GraphicsWindow|GW|Turtle)[\s]*\.[\s]*[a-z]/i,

// some indicators of QBasic
/\s+(function|sub)\s+/i,
/\swend\s+/i,
/(^|\s)declare\s+(function|sub)\s+[a-z]/i,
/(^|\n)[ \t]*COLOR\s*\,\s*\d+[ \t]*([\r\n']|$)/i,
/\sfor\s+[a-z]+\s*\=\s*[0-9]+\s+to\s+(\d+|[a-z_]+)/i,
/(^|\s)[a-z_][a-z0-9_]*[\$#%](\s|$)/i, 
// variable names sometimes end with $,%, or # in QBasic.
// This shouldn't ever be found in Sonic WebTurtle code.
// Sometimes ! is added to QBasic identifiers but we don't want to match that 
// because Sonic WebTurtle code is more likely to have that.

// some indicators of various AppleSoft BASIC
/([\r\n:]|^)[ \t]*([1-9]\d*[ \t]+)?(hplot|hgr|hgr2)[ \t]*([\r\n:]|$)/i,

// some indicators of SugarLabs Turtle Blocks JSON format(.tb and .ta files)
/^\s*\[\s*\[\s*0\s*,\s*\[/,

// indicators of Tektronix 405x BASIC
/(^|[\s:])[ \t]*(\d+[ \t]+)?FOR[ \t]+[a-z][a-z0-9_]*[ \t]*=[ \t]*-?\d+[ \t]+TO[ \t]+-?\d+/i,
/(^|[\s:])[ \t]*(\d+[ \t]+)?GO[ \t]+TO[ \t]+\d+/i,
/(^|[\s:])[ \t]*(\d+[ \t]+)?print[ \t]+\@\d/i, // for example, 210 PRINT @32,26:2
/(^|[\s:])[ \t]*(\d+[ \t]+)?(RDRAW|RMOVE|ROTATE)[ \t]+-?\d+[ \t]*,/i,
];
const likelyExpressions = [
/(^|[\r\n])\s*color\s+[\+-][0-9]+\s/i,
/(^|[\r\n])\s*remember\s*([\r\n]|$)/i,
/(^|[\r\n])\s*go\s+[a-z]+\r?\n/i, // call a procedure in Sonic WebTurtle
/(^|[\r\n])\s*(forget|goback)\s*([\r\n]|$)/i,
/(^|[\r\n])\s*move[ \t]+[-a-z\d]/i
];

const likelySets = [
	[/(^|[\r\n])\s*repeat[ \t]+(\d+|[a-z_]+)/i, /(^|[\r\n])\s*next\s*([\n\r]|$)/i],
	// the next expression is sometimes confused with QBasic's next keyword marking the end of a for-loop.
	// That is why the repeat and next patterns are paired together here.

	[/(^|[\r\n])\s*# [a-z]+\n/i, /(^|[\r\n])\s*RETURN\s*([\n\r]|$)/i]
	// Sonic WebTurtle procedure starts and ends.
	// we pair these patterns because each on its own will match a lot of other 
	// programming languages that have return statements or '#' for single-line comments.
];

export { antiExpressions, likelyExpressions };

export function isLikelySonicWebTurtle(code) {
	code = naiveStripComments(code);
	if (matchesARegex(antiExpressions, code))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegexSet(likelySets, code))
		return true;
	return false;
};