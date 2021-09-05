import { countRegexMatches } from
'../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../naiveStripComments.js';
import { StringBuffer } from '../../StringBuffer.js';

const nonProcessingRegexes = [
	// indicators of Python code using turtle graphics package
	/(^|\s)from\s+turtle\s+import\s/,
	/(^|\s)import\s+turtle($|\s)/,
	
	// indicators of BASIC
	/(^|\s)End[ \t]+(Function|Sub)($|\s)/i,
	
	// indicators of Go
	/(^|[\r\n])\s*import\s+"fmt"/,
	/(^|[\r\n])\s*func\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	
	// indicators of JavaScript Processing like P5.js
	/(^|[\r\n])\s*function\s+(draw|setup)\s*\(\s*\)\s*\{/,
	
	// WebLogo indicators
	/(^|[\n\r])\s*to\s+[a-z_][a-z_\d]*\s+:[a-z][a-z_\d]*/i, // a procedure with a parameter

	// indicators of POV-ray
	/(^|[\r\n])\s*#include[ \t]+"[a-z]/,
];

const processingRegexes = [
/(^|\s)void\s+setup\(\s*\)\s*\{/,
/(^|\s)void\s+draw\(\s*\)\s*\{/,
/(^|\s)size\s*\(\s*\d+\s*\,\s*\d+\s*\,\s*P3D\s*\)/, // for example size(400, 400, P3D)
];
const weakIndicators = [
/(^|\s)ArrayList\s*\<\s*[\w\W_][\w\W_\d]*\s*\>\s*[\w\W_][\w\W_\d]*/,
// For example, ArrayList<Particle> particles;
// /(^|\s)ArrayList\s*\<\s*[\w\W_][\w\W_\d]*\s*\>\s*[\w\W_][\w\W_\d]*/.test('ArrayList<Particle> particles;')
/(^|\s)char\s+[\w\W_][\w\W_\d]*\s*\=\s*\'[\s\w\W\d]\'/, // For example, char x = 'a';
/(^|[\n\r])\s*circle\s*\(\d+\s*,\s*\d+\s*,\s*\d+\s*\)/,
/(^|\s)class\s*[\w\W_][\w\W_\d]*\s*extends\s[\w\W_][\w\W_\d]*\s*\{/, // For example, class A extends B {
/(^|[\n\r])\s*color\s+[\w\W_]+\s*\=\s*[\w\W]/,
/(^|[\n\r])\s*ellipse\s*\(\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/,
/(^|\s)fill\s*\(\s*\d+\s*\)/, // For example, fill(153)
/(^|\s)final\s*(double|float|int|long)\s*[\w\W_][\w\W_\d]*\s*\=\s*\d+(\.\d*)?\s*/,
// for example, final float constant = 12.84753

/(^|\s)int\s*\[\s*\]/,
/(^|\s)int\s*[\w\W_][\w\W_\d]*/, // For example, int x
/(^|\s)interface\s*[\w\W_][\w\W_\d]*\s*\{/, // For example, interface A {
/(^|\s)line\s*\(\s*(\d+|[a-zA-Z_]+)\s*\,\s*(\d+|[a-zA-Z_]+)\s*\,\s*(\d+|[a-zA-Z_]+)\s*\,\s*(\d+|[a-zA-Z_]+)\s*\)/, 
// For example, line(1,5,3,3)
// another example, line(1,3,aa,3)
/(^|\s)loadPixels\s*\(\s*\)\s*;/, // For example, loadPixels()
/(^|\s)new\s+int\s*\[\s*\d+\s*\]/, // for example, new int[3]
/(^|\s)noStroke\s*\(\s*\)\s*;/, // For example, noStroke()
/(^|\s)noFill\s*\(\s*\)\s*;/, // For example, noFill()
/(^|\s)noLoop\s*\(\s*\)\s*;/, // For example, noLoop()
/(^|\s)noSmooth\s*\(\s*\)\s*;/, // For example, noSmooth()
/(^|\s)println\s*\(\s*"[\s\w\W\d_]*"\s*\)\s*;/, // for example, println("Alpha");
/(^|\s)println\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*\)\s*;/, 
 // for example, println(x);
 // or println(xa3);
/(^|\s)println\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\[\s*\d+\s*\]\s*\)\s*;/, 
// for example println(q[2]);

/(^|\s)arc\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*\)\s*;/,
// for example: arc(x, y, d, d, 0, QUARTER_PI);

// A pattern looking for specific Processing angle constants:
// this would match any code from above but 
/(^|\s)arc\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(HALF_PI|QUARTER_PI|TWO_PI)\s*\)\s*;/,

/(^|\s)printMatrix\s*\(\s*\)\s*;/,
/(^|\s)PImage\s*[\w\W_][\w\W_\d]*/,
/(^|\s)PVector\s*[\w\W_][\w\W_\d]*/,

/(^|\s)rect\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*\)\s*;/,
// for example, rect(120, 80, 220, 220);
/(^|\s)rect\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*\)\s*;/,
// for example, rect(120, 80, 220, 220, 28);
/(^|\s)rect\s*\(\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*,\s*(\d+|[a-zA-Z_][a-zA-Z_\d]*)\s*\)\s*;/,
// for example, rect(120, 80, 220, 220, 12, 24, 48, 72);

/(^|\s)rotateX\s*\(\s*\)\s*;/,
/(^|\s)rotateY\s*\(\s*\)\s*;/,
/(^|\s)rotateZ\s*\(\s*\)\s*;/,
/(^|\s)shearX\s*\(\s*\d+\s*\)/,
/(^|\s)shearX\s*\(\s*PI\s*\/\d+\.?\d*\s*\)\s*;/,
/(^|\s)size\s*\(\s*\d+\s*\,\s*\d*\s*\)\s*;/, // For example, size(640, 360)
/(^|\s)String\s*\[\s*\]/, // For example, String[]
/(^|\s)stroke\s*\(\s*\d+\s*\)\s*;/, // For example, stroke(153)
/(^|\s)translate\s*\(\s*(\d+|[a-zA-Z_]+)\s*\,\s*(\d+|[a-zA-Z_]+)\s*\)\s*;/,
];

function naiveStripCommentsForProcessing(code) {
	const lines = code.split('\n');
	const result = new StringBuffer();
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		const index = line.indexOf(';');
		if (index !== -1)
			line = line.substring(0, index + 1);
		result.append(line + '\n');
	}
	return result.toString();
}

/*
Trims lines in a way that should remove most of WebLogo comments
but keep the initial semicolon in place.
This should remove most of WebLogo comments that could make the checks inaccurate
without removing the ; which is commonly used in Processing at the end of statements.
*/
function foundEnoughWeakIndicators(code) {
	return countRegexMatches(code, weakIndicators) >= 2;
}

export function isLikelyProcessing(code) {
	const webLogoStrippedCode = naiveStripComments(code);
	if (matchesARegex(nonProcessingRegexes, webLogoStrippedCode))
		return false;
	if (matchesARegex(processingRegexes, webLogoStrippedCode))
		return true;
	const trimmedCode = naiveStripCommentsForProcessing(code);
	if (foundEnoughWeakIndicators(trimmedCode))
		return true;
	return false;
};