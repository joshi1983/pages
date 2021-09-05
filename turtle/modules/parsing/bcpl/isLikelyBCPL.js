import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	/(^|[\r\n])\s*import\s/
		// match some languages like JavaScript's import statements for modules.
		// Java and Python import statements
];
const signals = [
	/(^|[\r\n])\s*GET[ \t]+"LIBHDR"/,
	/(^|[\r\n])\s*GLOBAL[ \t]+\$[ \t]*\(/,
	/(^|[\r\n])\s*LET[ \t]+[a-zA-Z]+[ \t]*\(/
		// for example, LET START() BE ...
];

export function isLikelyBCPL(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};