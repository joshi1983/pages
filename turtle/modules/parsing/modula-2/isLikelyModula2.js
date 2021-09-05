import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';

const likelyRegexes = [
	/(^|[\r\n])[ \t]*MODULE[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*;/,
		// modula-2 is case-sensitive so we're not using a trailing i.
];

const likelyRegexSets = [
	[/(^|[\r\n])[ \t]*\(\*/, /\s\*\)/],
		// multi-line comments
	[/(^|[\r\n])[ \t]*PROCEDURE[ \t]+[a-zA-Z_]+/,
	/(^|[\r\n])[ \t]*VAR\s/,
	/(^|[\r\n])[ \t]*BEGIN\s/,
	/(^|[\r\n])[ \t]*END[ \t]+[a-zA-Z_]/]
		// common patterns if a Modula-2 procedure is defined.
];

export function isLikelyModula2(code) {
	if (matchesARegex(likelyRegexes, code))
		return true;
	if (matchesARegexSet(likelyRegexSets, code))
		return true;
	return false;
};