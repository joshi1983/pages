import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
	/(^|[\r\n])\s*#/,
		// sometimes found in Python comments, c and c++ preprocessor directives...

	/(^|[\r\n])\s*import\s*{\s*[a-zA-Z_]/,
		// matches some import statements from JavaScript

	/(^|[\r\n])\s*function\s+[a-z_][a-z_\d]*\d*\(/i 
		// indicates JavaScript and some other languages. 'function' is not a keyword in Go.
];

const signals = [
	/(^|[\r\n])type\s+[a-zA-Z_][a-zA-Z_\d]*\s+struct\s*\{/,
	/(^|[\r\n])[ \t]*(defer[ \t]+)?fmt\s*\.\s*Print(f|ln)?\s*\(\s*([a-zA-Z_\"]|<-)/,
	/"github.com\/Pitrified\/go-turtle"/,
	/\.\s*(NewTurtleDraw|NewWorld|NewWorldWithColor|NewWorldWithImage)\s*\(/,
	/(^|[\r\n])[ \t]*import\s*\(\s*\"/,
	
	/(^|[\r\n])[ \t]*go[ \t]+func\s*\(/
];

export function isLikelyPitrifiedGoTurtle(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};