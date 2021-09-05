import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../naiveStripComments.js';

const antiExpressions = [
/(^|\s)forward\s+/i,
/(^|\s)fd\s+/i, 
// fd is very common in most Logo variants.
// "draw" or "move" commands are used instead in Sonic WebTurtle.

/(^|\s)setpc\s+/i,
/(^|\s)setpencolor\s+/i,
/(^|\s)setpenwidth\s+/i,
/(^|\s)setpensize\s+/i,
/(^|\s)make\s+\"/i,
/(^|\s)for\s*\[/i,
/(^|\s)repeat\s+\d+\s*\[/i,
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

// some indicators of Small Visual Basic
/(^|\s)(Colors|GraphicsWindow|GW|Turtle)[\s]*\.[\s]*[a-z]/i,

// some indicators of QBasic
/\s+(function|sub)\s+/i,
/\swend\s+/i,
/(^|\s)declare\s+(function|sub)\s+[a-z]/i,
/\sfor\s+[a-z]+\s*\=\s*[0-9]+\s+to\s*[0-9]+/i,
/(^|\s)[a-z_][a-z0-9_]*[\$#%](\s|$)/i, 
// variable names sometimes end with $,%, or # in QBasic.
// This shouldn't ever be found in Sonic WebTurtle code.
// Sometimes ! is added to QBasic identifiers but we don't want to match that 
// because Sonic WebTurtle code is more likely to have that.
];
const likelyExpressions = [
/(^|\s)color\s+[\+-][0-9]+\s/i,
/(^|\s)remember\s+/i,
/(^|\s)go\s+[a-z]+\r?\n/i, // call a procedure in Sonic WebTurtle
/(^|\s)goback\s+/i,
/(^|\s)forget\s+/i,
/(^|\s)move\s+/i,
/(^|\s)next\s+/i,
// sometimes confused with QBasic's next keyword marking the end of a for-loop.

/(^|\s)endif\s+/i,
/# [a-z]+\n/i
// For example, "# test\n" which could start the definition of a procedure in Sonic WebTurtle
];

export { antiExpressions, likelyExpressions };

export function isLikelySonicWebTurtle(code) {
	code = naiveStripComments(code);
	if (matchesARegex(antiExpressions, code))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};