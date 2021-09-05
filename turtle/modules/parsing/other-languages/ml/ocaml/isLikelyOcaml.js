import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indications of Module-2 and Pascal
	/(^|[\r\n])\s*var[ \t]+[a-z_][a-z_\d]*[ \t]*,[ \t]*[a-z_]/i,
	/(^|[\r\n])[ \t]*PROCEDURE[ \t]+[a-zA-Z_]+/i,
	/(^|[\r\n])[ \t]*BEGIN\s*[\r\n]/i,
	/(^|[\r\n])\s*[a-z_][a-z_\d]*[ \t]*:=/i,

	// indicators of Haskell
	/(^|[\r\n])[ \t]*{-#/,
	/(^|[\r\n])[ \t]*main[ \t]*=[ \t]*(do\s*[\r\n]|print\s|putStrLn\s)/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*(let[ \t]+)?fun[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\([ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*:/,
	/(^|[\r\n])\s*let[ \t]*([ \t]*)[ \t]*=*/
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])\s*\(\*/.test(code)) {
		// Ocaml comments starting with (* should end with *).
		if (code.indexOf('*)') === -1)
			return true;
	}
	if (/(^|[\r\n])\s*if\s/.test(code)) {
		// if-statements in Ocaml always have "then".
		if (!/\sthen\s/.test(code))
			return true;

		// if-statements in Ocaml always have "else".
		if (!/\selse\s/.test(code))
			return true;
	}	
	return false;
}

export function isLikelyOcaml(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};