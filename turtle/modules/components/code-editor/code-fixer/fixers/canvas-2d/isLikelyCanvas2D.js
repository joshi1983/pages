import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';
import { povRayRegexes } from '../../../../../parsing/pov-ray/isLikelyPovRay.js';

const unlikelyPatterns = [
// indicator of Python comment at start of file or line
/(^|\n)#/,
// python procedure definition
/(^|\n)def\s+[a-zA-Z_]+\s*\(/,

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

// A couple indicators of Sonic WebLogo:
/(^|\s)end\s*$/i,
/(^|\s)repeat\s+\d+\s+[a-z]/i,
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
	if (matchesARegex(likelyPatterns, code))
		return true;
	return false;
};