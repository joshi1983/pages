import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Logo
	/(^|[\r\n])\s*to[ \t]+[a-z_]/i,
];

const arcRegexes = [
	/\(\s*pr\s+"/,
	/\(\s*prn\s+/,
	/\[\s*onlink\s+"/,
	/\(\s*with\s+\(/,
];

export function isLikelyArc(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(arcRegexes, code))
		return true;
	return false;
};