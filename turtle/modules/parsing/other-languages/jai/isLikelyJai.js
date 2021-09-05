import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*#import[ \t]+"(Basic|Compiler|Sort|String)"[ \t]*;/,
	/(^|[\r\n])[ \t]*main[ \t]*::[ \t]*\([ \t]*\)\s*\{/,
	/(^|[\r\n])[ \t]*call_with[ \t]*::[ \t]*\(/
];

export function isLikelyJai(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};