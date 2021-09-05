import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*(def|double|float|fun|int|void)[ \t]+\$?[a-zA-Z_][a-zA-Z_]*[ \t]*\(/,
		// this would match function/procedure definitions from various languages including:
		// c, c++, JavaScript, Pascal, Python

	/(^|[\r\n])\s*(func|function|procedure)[ \t]+\$?[a-z_][a-z_]*[ \t]*\(/i
		// Basic and Pascal are case-insensitive so this will match any case of "function" and "procedure".
];

const likelyRegexes = [
	/(^|[\r\n])\s*import[ \t]+(gleam|gleeunit)[ \t]*([\r\n]|\/[ \t]*[a-z_])/
];

export function isLikelyGleam(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};