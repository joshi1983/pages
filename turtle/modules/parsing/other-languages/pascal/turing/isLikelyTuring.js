import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*print[ \t]+[a-z_\d:]/i
		// Turing uses 'put' instead of 'print'.
];
const likelyRegexes = [
	/[\r\n]\s*end[ \t]+loop\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*for[ \t]+[a-z_][a-z_\d]*\s*:\s*\d+\s*../i
];
const weakLikelyRegexes = [
	/(^|[\r\n])\s*%/,
	/(^|[\r\n])\s*exit[ \t]+when[ \t]+[a-z_]/i,
	/(^|[\r\n])\s*put[ \t]+"[^"\r\n]*"[ \t]*([,\r\n]|$)/i
];

// "naive" because this ignores the fact that % won't mark comments
// when in a string literal.
// We accept that drawback for sake of keeping this code simple and performant.
function naiveStripTuringComments(code) {
	const lines = [];
	for (let line of code.split('\n')) {
		const index = line.indexOf('%');
		if (index !== -1)
			line = line.substring(0, index);

		lines.push(line);
	}
	return lines.join('\n');
}

function hasUnlikelyCombinations(code) {
	if (/(^|[\r\n])\s*if\s/i.test(code)) {
		// Turing if-statements always include "then".
		if (!(/\sthen\s/i.test(code)))
			return true;

		// Turing if-statements always have 'end if'.
		if (!(/\send[ \t]+if(\s|$)/i.test(code)))
			return true;
	}
	if (/(^|[\r\n])\s*loop\s/i.test(code)) {
		// Turing loop-statements always have 'end loop'.
		if (!(/\send[ \t]+loop(\s|$)/i.test(code)))
			return true;
	}
	if (/(^|[\r\n])\s*for\s/i.test(code)) {
		// Turing for-statements always have 'end for'.
		if (!(/\send[ \t]+for(\s|$)/i.test(code)))
			return true;
	}
	return false;
}

export function isLikelyTuring(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasUnlikelyCombinations(code))
		return false;

	const turingTrimmedCode = naiveStripTuringComments(code);
	if (matchesARegex(likelyRegexes, turingTrimmedCode))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};