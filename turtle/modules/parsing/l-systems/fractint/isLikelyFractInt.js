import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from
'../../naiveStripComments.js';

const antisignals = [
	// EcmaScript 6+ import statements
	/(^|[\r\n])[ \t]*import\s*\{/,
];
const signals = [
];
const signalSets = [
	[/(^|[\r\n])[ \t]*[a-z][a-z_\d]*\s*\{\s/i, /[\r\n][ \t]*Axiom\s/i, /}\s*$/]
];

export function isLikelyFractInt(code) {
	code = naiveStripComments(code);
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	if (matchesARegexSet(signalSets, code))
		return true;
	return false;
};