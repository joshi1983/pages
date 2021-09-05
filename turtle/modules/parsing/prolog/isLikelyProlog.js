import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
];

const likelyRegexes = [
	/(^|[\r\n])\s*:-\s/,
	/(^|[\r\n])\s*[a-z_]+\s*:-/,
	/(^|[\r\n])\s*[a-z_]+\s*\([^\)]*\)\s*:-/,
	/\)\s*:-\s*[a-z]/i,
];

export function isLikelyProlog(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};