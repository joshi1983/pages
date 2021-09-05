import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
];
const signals = [
	/(^|[\r\n])\s*:[ \t]+[a-z]+[ \t]+([-]?[\d]|[a-z])/i,
];

export function isLikelyForth(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};