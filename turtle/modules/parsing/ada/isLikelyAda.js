import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	// indicators of Logo
	/(^|[\r\n])\s*repeat\s\d+\s*\[/i
];

const likelyIndicators = [
	/(^|[\r\n])\s*with[ \t]+Ada\s*./,
	/(^|[\r\n])\s*package[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+is\s/,
	/(^|[\r\n])\s*procedure[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+is\s/ 
];

export function isLikelyAda(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(likelyIndicators, code))
		return true;
	return false;
};