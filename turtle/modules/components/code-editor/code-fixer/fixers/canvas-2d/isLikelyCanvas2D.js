import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';
import { naiveStripJavaScriptComments } from '../../../../../parsing/js-parsing/naiveStripJavaScriptComments.js';
import { povRayRegexes } from '../../../../../parsing/pov-ray/isLikelyPovRay.js';

const unlikelyPatterns = [
// indicator of Python comment at start of file or line
/(^|\n)#/,
/(^|\s)for\s+[a-zA-Z_][a-zA-Z0-9_]*\s+in\s+range\(/, // typical for-loop in Python
// python procedure definition
/(^|\n)def\s+[a-zA-Z_]+\s*\(/,
/(^|\s)from\s+turtle\s+import($|\s)/, // common import statement from Python that uses turtle graphics

// some indicators for WebLogo or FMSLogo or MSWLogo:
/(^|\s|\[)fd\s+[\d|:]/i,
/(^|\s|\[)forward\s+[\d|:]/i,
/(^|\s|\[)setpencolor\s+/i,
/(^|\s|\[)setpensize\s+[\[\d\:]/i,
/(^|\s|\[)setfillcolor\s+/i,
/(^|\s|\[)polystart\s+/i,
/(^|\s|\[)make\s+\"/i,
/(^|\s|\[)localmake\s+\"/i,
/(^|\s|\[)repeat\s+\d+\s*\[/i,

/(^|\s|\[)rpt\s+\d+\s*\[/i,
/(^|\s|\[)penwidth\s+\d+/i,

// a couple indicators of ASM Turtle:
/(^|\s)@@[a-z]+\:/i,

// A couple indicators for KTurtle:
/(^|\s)endFill\s*\(/,
/(^|\s)setColor\s*\(/,
/(^|\s)setScale\s*\(/,
/(^|\s)setSpeed\s*\(/,

// Some indicators of Odin
/(^|\s)fmt\s*\.\s*println\s*\(/,
/(^|\s)import\s+\"core\:/,
// could be an assignment from the Odin language
/(^|\s)[a-z_][a-z0-9_]*\s*\:\=\s*[a-z_][a-z0-9_]*/i,

// A couple indicators for Processing
/(^|\s)void\s+[\w\W_]+\s*\(\s*\)\s*\{/, // a void function definition which takes no parameters.
// "void" is not something commonly used in JavaScript function declarations.
// For example, void setup() {
// void draw() {
/(^|\s)size\s*\(\s*\d+\s*\,\s*\d*\s*\)/, // For example, size(640, 360)
/(^|\s)size\s*\(\s*\d+\s*\,\s*\d+\s*\,\s*P3D\s*\)/, // for example, size(400, 400, P3D)
/(^|\s)(byte|int|float)\s+[\w\W+_][\w\W+_\d]*\s*\=\s*\d+/, // a declaration with initialization like int gridSize = 40
/(^|\s)(boolean|byte|char|float|int|String)\s+[\w\W+_][\w\W+_\d]*\s+/, 
// a declaration like int gridSize
/(^|\s)(boolean|byte|char|float|int|String)\s*\[\s*\]\s*[\w\W+_][\w\W+_\d]*\s+/,
// declaration of an array like int[] gridSizes

/(^|\s)fill\s*\(\s*(\d+|[\w\W+_][\w\W+_\d]*)\s*\)/,
/(^|\s)stroke\s*\(\s*(\d+|[\w\W+_][\w\W+_\d]*)\s*\)/,
/(^|\s)noStroke\s*\(\s*\)\s*/, // for example, noStroke()
/(^|\s)noFill\s*\(\s*\)\s*/, // for example, noFill()
/(^|\s)println\s*\(\s*[\w\W+_][\w\W+_\d]*\s*\)/, // for example, println(c)
/(^|\s)import\s+processing\./, // for example, import processing.serial.*; 

// A couple indicators of Sonic WebLogo:
/(^|\s)end\s*$/i,
/(^|\s)repeat\s+\d+\s+[a-z]/i,

// indicators of Small Visual Basic:
/(^|\s)(Colors|GraphicsWindow|GW)[\s]*\.[\s]*[a-z]/i,
/(^|\s)Turtle\s*\.\s*(Angle|CreateFigure|DirectTurn|FillFigure|Hide|MoveTo|PenDown|PenUp|Show|Speed|TurnRight|UseAnimation|Width)/,

// indicators of QBasic
/\s(declare|end)\s+(function|sub)\s+[a-z]/i,
/\swend\s+/i,
/(^|\s)circle\s+\([1-9][0-9]+\s*\,\s*[1-9][0-9]+\s*\)\,/i,
/(^|\s)INKEY\$[\s\=]/,
/(^|\s)PSET\s+\(\s*[a-z_][a-z0-9_]*[!%]?\s*[-+*/]\s*/i, // for example PSET (x + 3
/(^|\s)PSET\s+\(\s*[0-9]+\s*\,\s*[0-9]+\s*\)\,/, // for example, PSET ( 3, 4),
/(^|\s)LINE\s+\(\s*[0-9]+\s*\,\s*[0-9]+\s*\)-\(\s*[0-9]+\s*\,\s*[0-9]+\s*\)\,/,
/(^|\s)print\s+[a-z_][a-z_0-9]*[%!&#\$]?(\s|$)/i, // for example, PRINT a
/(^|\s)print\s+"[^"\\n]*"\s*[,;]?(\s|$)/i, // for example, PRINT "hello,"; x
/(^|\s)gosub[\s]+[a-z_][a-z_0-9]*($|\s)/i, // calling a subroutine defined with a label.
/(^|\s)on\s+[a-z]+\s+gosub\s+[1-9]/i,
/(^|\s)end\s+def($|\s)/i,
/(^|\s)goto\s+[1-9][0-9]*\s*(\n|else|end)/i, // goto line number
/(^|\s)goto\s+[a-z_][a-z_0-9]*\s*(\n|end)/i, // goto label name
/(^|\s)dim\s+[a-z_]+\s*\(/i, 
	// declare in memory.. very unique to the Basic programming language.
];

const unlikelyPatternsWithoutCommentStripping = [
	// patterns for SugarLabs Turtle Blocks HTML exports
	/code"\>\s*\[\s*\[\s*0\s*\,/
];

const unlikelyPatternsOutsideJavaScriptComments = [
/(^|\s)to($|\s)/i,
];

ArrayUtils.pushAll(unlikelyPatterns, povRayRegexes);
const likelyPatterns = [
/\/\/[^']*($|\n)/, // JavaScript-style single line comment
// Exclude the apostrophe ' in the line to avoid undesirable matches
// from string literals containing URL's.
/canvas\s*\.\s*getContext\s*\(/,
/\.beginPath\s*\(/,
/\.\s*fill\s*\(/,
/\.\s*stroke\s*\(/,
/(^|\s)function\s+/,
/(^|\s)const\s+/,
/(^|\s)var\s+/,
/(^|\s)let\s+/,
];

export function isLikelyCanvas2D(code) {
	if (matchesARegex(unlikelyPatternsWithoutCommentStripping, code))
		return false;
	const codeWithoutWebLogoComments = naiveStripComments(code);
	if (matchesARegex(unlikelyPatterns, codeWithoutWebLogoComments)) {
		return false;
	}
	const codeWithoutJavaScriptComments = naiveStripJavaScriptComments(code);
	if (matchesARegex(unlikelyPatternsOutsideJavaScriptComments, codeWithoutJavaScriptComments))
		return false;
	if (matchesARegex(likelyPatterns, code))
		return true;
	return false;
};