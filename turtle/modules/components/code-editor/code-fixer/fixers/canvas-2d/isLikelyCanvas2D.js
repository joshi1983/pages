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
];
const unlikelyPatternsOutsideJavaScriptComments = [
/(^|\s)to($|\s)/i,
];

ArrayUtils.pushAll(unlikelyPatterns, povRayRegexes);
const likelyPatterns = [
/\/\//,
/\/\*/,
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