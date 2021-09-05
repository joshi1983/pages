import { countRegexMatches } from
'../helpers/countRegexMatches.js';
import { matchesARegex } from '../helpers/matchesARegex.js';
import { matchesARegexSet } from
'../helpers/matchesARegexSet.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyPatterns = [
	// indicators of BASIC
	/(^|[\r\n])\s*[a-z\d]+[ \t]*:/i, // label
	/(^|[\r\n])\s*dim[ \t]+[a-z]/i,
		// BASIC dialects generally declare variables using DIM.
		// SeaTurtle uses "set".
	/(^|[\r\n])\s*end[ \t]+(function|if|sub)/i,
	/(^|[\r\n])\s*next([\r\n]|[ \t]+[a-z])/i,
	
	/(^|[\r\n])\s*screen[ \t]+\d/i,
		// BASIC commonly use lines like screen 4.
		// SeaTurtle doesn't.
	/(^|[\r\n])\s*wend\s*([\r\n]|$)/i,
		// BASIC's end to a while-loop

	// indicators of other versions of Logo:
	/(^|[\r\n])\s*(setPenColor|setScreenColor)[ \t]+"[a-z]+/i,
		// SeaTurtle has background and color instead of setScreenColor and setPenColor.
	
	/(^|[\r\n])\s*repeat[ \t]+\d+[ \t]*\[/i,
		// SeaTurtle marks the start of repeat instruction lists byte
		// breaking the line instead of [.

	/(^|[\r\n])\s*to[ \t]+[a-z_.][a-z_.]*[\s:]/i,
		// SeaTurtle uses "sub" instead of "to" to mark the start of its subroutines/procedures.
];

const likelyPatterns = [
];

const likelySets = [
	[
		/(^|[\r\n])\s*sub[ \t]+[a-z][a-z]*[ \t]*([\r\n]|$)/i,
		/[\r\n]\s*end[ \t]*([\r\n]|$)/i
	]
];

const weakLikelyPatterns = [
	/(^|[\r\n])\s*call[ \t]+[a-z][a-z]*[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*penhide[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*penshow[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*repeat[ \t]+\d+[ \t]*[\r\n]\s*[a-z]/i,
	/(^|[\r\n])\s*set[ \t]+[a-z_]+[ \t]+-?\d+[ \t]*([\r\n]|$)/i,
];

function containsLikelyStringTemplate(code) {
	for (let line of code.split('\n')) {
		const index = line.indexOf('"');
		if (index !== -1) {
			line = line.substring(index + 1);
			const endIndex = line.indexOf('"');
			if (endIndex !== -1) {
				line = line.substring(0, endIndex);
				if (/\$[a-z]/i.test(line))
					return true;
			}
		}
	}
	return false;
}

export function isLikelySeaTurtle(code) {
	const strippedCommentsCode = naiveStripComments(code);
	if (matchesARegex(unlikelyPatterns, strippedCommentsCode))
		return false;

	if (matchesARegex(likelyPatterns, strippedCommentsCode))
		return true;

	if (matchesARegexSet(likelySets, strippedCommentsCode))
		return true;

	const matchCount = countRegexMatches(strippedCommentsCode, weakLikelyPatterns);
	if (matchCount >= 2)
		return true;
	if (matchCount >= 1) {
		if (containsLikelyStringTemplate(strippedCommentsCode))
			return true;
	}
	return false;
};