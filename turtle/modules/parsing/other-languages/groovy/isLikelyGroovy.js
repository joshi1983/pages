import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of Logo
	/(^|[\r\n])\s*(backward|fd|forward|jumpBackward|jumpForward)\s+-?\d/i,
	/(^|[\r\n])\s*to\s+[a-z_.][a-z_.\d]*\s/i,
		// procedure definition in Logo
		
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\([ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*[,\)]/,
		// for example void p(x,
		// Groovy would need a data type for its parameter so that pattern indicates invalid Groovy code.

	// indicators of Kojo:
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_][a-zA-Z_\d]*\(\s*[a-zA-Z_][a-zA-Z_\d]*\s*:/,
		// for example, def tree(n: 
		// That would match some Kojo or Scala code but generally not Groovy because of the :.
		// It could be in a multiline comment in Groovy but that is very unlikely.

	/(^|[\r\n])\s*hop[ \t]*[\r\n]\s*hop/,
	/(^|[\r\n])\s*repeat\s*\(\s*\d+\s*\)\s*\{/,
	/(^|[\r\n])\s*repeatFor\s*\(\s*\d+\s+to\s+/,
	/(^|[\r\n])\s*(val|var)\s+[a-zA-Z_][a-zA-Z_\d]*\s*=\s/
];

const likelyRegexes = [
	/(^|[\r\n])\s*(assert|(if|while)\s*\()[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*==[ \t]*\[/,
		// for example, assert odds == [1, 3, 5, 7, 9]
		// or if ( x == [1,2,3
		// or while ( x == [1,2,3
		// Comparing with an Array or list literal like this is pretty rare in most other programming languages.
		// In Java, such expressions would be comparing references instead of values.

	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*-?\d[ \t]*;/,
		// for example, def x=5;

	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(\s*[a-zA-Z_][a-zA-Z_\d]*\s+[a-zA-Z_][a-zA-Z_\d]*\s*\)\s*\{/,
		// for example,  def declare(BigDecimal value) {

	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*=\s*(delegate\s|new\s)/,
		// for example, def x = new StringWriter(
		// or def stringColor = delegate
	
	/(^|[\r\n])\s*(boolean|byte|double|float|int|long|short|void)[ \t]+"[a-zA-Z_]/
		// Quoted Identifiers are rarely used in Groovy but 
		// if this pattern is found, it should strongly indicate Groovy.
];
const weakLikelyRegexes = [
	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(\s*[a-zA-Z_][a-zA-Z_\d]*\s+[a-zA-Z_][a-zA-Z_\d]*\s*[\),]/,
		// For example, def declare(BigDecimal value,
	
	/(^|[\r\n])\s*def[ \t]+\$?[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \ta-zA-Z_\d\(\[]/,
	/.[ \t]*rcurry[ \t]*\(/
];

export function isLikelyGroovy(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};