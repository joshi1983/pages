import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyPatterns = [
// indicators of Python
/\nimport\s/,
/(^|\s)import\s+turtle(\s|$)/,
/(^|\n)#/, // indicator of Python comment at start of file or line


];
const likelyPatterns = [
/(^|[\s\(\[])stamprect\s+[1-9]/i,
/(^|[\s\(\[])play\s+\[\s*(([a-z]*([1-9][0-9]*)?|[0-9]+)\s+)*([a-z]*([1-9][0-9]*)?|[0-9]+)?\s*[\[\]]/i,
/(^|[\s\(\[])snap\s+[1-9][0-9]*\s+[1-9][0-9]*(\s|$)/i,
/(^|[\s\(\[])(tt|turtletext)\s+\[\s*[a-z]+/i,
];
const weakIndicators = [
/(^|\s)to\s+about\s*\n/i,
/(^|[\s\(\[])getxy(\s|$)/i,
/(^|[\s\(\[])if\s+(:[a-z_]+[0-9]*|[0-9]+)\s(=|<|>|<=|>=)\s*(:[a-z_]+[0-9]*|[0-9]+)\s+then\s+/i,
// if then statement is somewhat unique to Terrapin.
// Most other Logo versions don't support the "then" keyword.

/(^|[\s\(\[])ignore\s+[a-z]+/i,
/(^|[\s\(\[])setbg\s+([0-9]+|"[a-z]+)(\s|$)/i,
/(^|[\s\(\[])(setw|setwidth)\s+[0-9]+(\s|$)/i,
];

function foundEnoughWeakIndicators(code) {
	const minCount = 2;
	let count = 0;
	for (let r of weakIndicators) {
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