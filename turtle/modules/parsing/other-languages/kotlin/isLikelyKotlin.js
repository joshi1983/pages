import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Kojo
	/(^|[\r\n])\s*repeat\s*\(\s*\d+\s*\)\s*\{/,
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s*\(/
];

const likelyRegexes = [
	/(^|[\r\n])\s*((internal|override|private|protected|public)\s+)?val[ \t]+[a-zA-Z][a-zA-Z_\d]*\s*[=:]/,
	/(^|[\r\n])\s*fun\s+main\s*\(\s*\)\s*{/
];

export function isLikelyKotlin(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};