import { countRegexMatches } from
'../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	// indicators of Logo
	/(^|[\r\n])\s*forward\s/i,
	/(^|[\r\n])\s*repeat\s\d+\s*\[/i
];
const weakIndicators = [
	/(^|[\r\n])PA\d+,/,
	/(^|[\r\n])IN(PD|PU)?;/,
	/(^|[\r\n])(PD|PU);/,
	/(^|[\r\n])(PD|PU)\-\d/
];

export function isLikelyHPGL(code) {
	if (matchesARegex(antisignals, code))
		return false;

	if (countRegexMatches(code, weakIndicators) > 1)
		return true;

	return false;
};