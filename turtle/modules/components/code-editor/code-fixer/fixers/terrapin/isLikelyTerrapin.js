import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyPatterns = [
// indicators of FMSLogo and WebLogo
/(^|[\s\(\[])ifelse\s+/i, // ifelse isn't supported by Terrapin.
/(^|[\s\(\[])jumpto\s+/i,
/(^|[\s\(\[])perspective\s+/i,
/(^|[\s\(\[])polyend\s+/i,
/(^|[\s\(\[])polyStart\s+/i,
/(^|[\s\(\[])polyview\s+/i,
/(^|[\s\(\[])setposxyz\s+(\[|:[a-z_])/i,
/(^|[\s\(\[])setxyz\s+/i,
/(^|[\s\(\[])YesNoBox\s+/i,

// indicators of Python
/\nimport\s/,
/(^|\s)import\s+turtle(\s|$)/,
/(^|\n)#/, // indicator of Python comment at start of file or line

// some indicators of QBasic
/(^|[\s\(\[])screen\s+[1-9][0-9]*/i,
/(^|[\s\(\[])DIM\s+[a-z]/,
/(^|[\s\(\[])SUB\s+[a-z]/,
];
const likelyPatterns = [
/(^|[\s\(\[])lmake\s+"[a-z_][a-z_0-9]*(\s|$)/i,
/(^|[\s\(\[])play\s+\[\s*(([a-z]*([1-9][0-9]*)?|[0-9]+)\s+)*([a-z]*([1-9][0-9]*)?|[0-9]+)?\s*[\[\]]/i,
/(^|[\s\(\[])play\s+"[a-z]+(\s|$)/i,
/(^|[\s\(\[])snap\s+[1-9][0-9]*\s+[1-9][0-9]*(\s|$)/i,
/(^|[\s\(\[])stamprect\s+[1-9]/i,
/(^|[\s\(\[])(tt|turtletext)\s+\[\s*[a-z]+/i,
];
const weakIndicators = [
/(^|\s)to\s+about\s*\n/i,
/(^|[\s\(\[])cs\s+/i,
/(^|[\s\(\[])fs\s+/i,
/(^|[\s\(\[])getxy(\s|$)/i,
/(^|[\s\(\[])if\s+(:[a-z_]+[0-9]*|[0-9]+)\s(=|<|>|<=|>=)\s*(:[a-z_]+[0-9]*|[0-9]+)\s+then\s+/i,
// if then statement is somewhat unique to Terrapin.
// Most other Logo versions don't support the "then" keyword.

/(^|[\s\(\[])ignore\s+[a-z]+/i,
/(^|[\s\(\[])setbg\s+([0-9]+|"[a-z]+)(\s|$)/i,
/(^|[\s\(\[])(setw|setwidth)\s+[0-9]+(\s|$)/i,
/(^|[\s\(\[])setpc\s+/i,
];

function foundEnoughWeakIndicators(code) {
	const minCount = 2;
	let count = 0;
	for (const r of weakIndicators) {
		if (r.test(code)) {
			count++;
			if (count === minCount)
				return true;
		}
	}
	return false;
}

export function isLikelyTerrapin(code) {
	code = naiveStripComments(code);
	if (matchesARegex(unlikelyPatterns, code)) {
		return false;
	}
	if (matchesARegex(likelyPatterns, code))
		return true;
	if (foundEnoughWeakIndicators(code))
		return true;
	return false;
}