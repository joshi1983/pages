import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
];

const signals = [
	/(^|[\r\n])[ \t]*fn\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/,
	/(^|[\r\n])[ \t]*use\s+turtle\s*::\s*{/
];

export function isLikelyRustTurtle(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};