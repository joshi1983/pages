import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from
'../../naiveStripComments.js';
import { StringUtils } from
'../../../StringUtils.js';

const antisignals = [
	// indicators of fractint
	/(^|[\r\n])[ \t]*[a-z][a-z_\d]*\s*\{\s/i
];
const signals = [
];
const signalSets = [
	[
		/(^|[\r\n])[ \t]*(order|rotate|angle)[ \t]+-?[1-9][0-9]*[ \t]*[\r\n]/,
		/(^|[\r\n])[ \t]*[A-Z][ \t]*=[ \t]*[@A-Z\[\]\<\>\+\-]/
	]
];

const axiomPattern = /[\r\n][ \t]*axiom[ \t]+[@A-Z\[\]\<\>\+\-]/i;

export function isLikelyCGJennings(code) {
	code = StringUtils.sanitizeLineBreaks(code);
	code = naiveStripComments(code);
	if (!axiomPattern.test(code))
		return false;
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	if (matchesARegexSet(signalSets, code))
		return true;
	return false;
};