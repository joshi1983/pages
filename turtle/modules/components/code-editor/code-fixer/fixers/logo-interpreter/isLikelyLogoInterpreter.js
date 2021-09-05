import { countRegexMatches } from
'../helpers/countRegexMatches.js';
import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyPatterns = [
// indicators of WebLogo
/(^|\s)setscreencolor\s+/i,

// indicators of WebLogo, MSWLogo, and FMSLogo
/(^|\s)polystart\s+/i,
/(^|\s)polyend\s+/i,

// indicator of Python comment at start of file or line
/(^|\n)#/,
/(^|\s)for\s+[a-zA-Z_][a-zA-Z0-9_]*\s+in\s+range\(/, // typical for-loop in Python
// python procedure definition
/(^|\n)def\s+[a-zA-Z_]+\s*\(/,
/(^|\s)from\s+turtle\s+import($|\s)/, // common import statement from Python that uses turtle graphics
];

const likelyPatterns = [
/(^|\s)\(:[a-z_][a-z0-9_]*\s+\+[1-9][0-9]*\)/i,
// The + operator was found adjacent to a digit in a few examples.
// This isn't valid in WebLogo and some other Logo variants because 
// the + can indicate a 
// positive integer literal.  A space is needed to indicate it is a binary + operator.

/(^|\s)cancelpath($|\s)/i,
/(^|\s)cubiccurve\s+-?[1-9][0-9]*\s+/i,
/(^|\s)flabel\s+(\[|"[a-z0-9_])/i,
/(^|\s)go\s+"[1-9][0-9]*\s+(true|false)($|\s)/i,
/(^|\s)quadcurve\s+-?[1-9][0-9]*\s+/i,
/(^|\s)repcount\s*%\s*/i, 
// % is a modulo operator in LogoInterpreter but not in most other Logo variants.

/(^|\s)setbgimg\s+"[a-z0-9_!&%]+($|\s)/i,
/(^|\s)(setcolor|setbgcolor)\s+"[1-9][0-9]($|\s)/i, 
// setcolor is in some other Logo variants but string literals like "1 
// are very unique to LogoInterpreter code.
// no quote before an integer is common for a color but quoting it is very unique.

/(^|\s)setlabelheight\s+[1-9][0-9]*($|\s)/i,
/(^|\s)shadow\s+[1-9][0-9]*($|\s)/i,
/(^|\s)shadowcolor\s+"([0-9][1-9]*|[a-z]+|#[0-9a-f]{6})(^|\s)/i,
/(^|\s)shadowoffset\s+[1-9][0-9]*\s+[1-9][0-9]\s*/i,
];
const weakIndicators = [
/(^|\s)arc\s+360\s+:[a-z]+/i,
/(^|\s)beginpath(^|\s)/i,
/(^|\s)setbgcolor\s+"([a-z]+|#[0-9a-f]{6})(^|\s)/i,
/(^|\s)stamp(^|\s)/i,
/(^|\s)window(^|\s)/i,
];

function foundEnoughWeakIndicators(code) {
	return countRegexMatches(code, weakIndicators) >= 2;
}

export function isLikelyLogoInterpreter(code) {
	const codeWithoutWebLogoComments = naiveStripComments(code);
	if (matchesARegex(unlikelyPatterns, codeWithoutWebLogoComments)) {
		return false;
	}
	if (matchesARegex(likelyPatterns, codeWithoutWebLogoComments))
		return true;

	if (foundEnoughWeakIndicators(codeWithoutWebLogoComments))
		return true;

	return false;
};