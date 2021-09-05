import { matchesARegex } from '../helpers/matchesARegex.js';

const notLikelyCodeHeartTurtleScriptRegexes = [
	// some indicators of Logo:
/(^|\s)forward/i, /(^|\s)FD\s/, /(^|\s)backward\s/i,

/(^|[\r\n])\s*(setFillColor|setPenColor|setPos)\s/,

	// some indicators of Kojo code:
	/(^|[\r\n])\s*setBackground\s*\(/,
	/(^|[\r\n])\s*setSpeed[ \t]*\([ \t]*superFast[ \t]*\)/,
	/(^|[\r\n])\s*def[ \t]+[a-zA-Z_]/,
];
const likelyCodeHeartTurtleScriptRegexes = [
/(^|\s)startFill\s*\(\s*[A-Z]+\s*\)($|\s)/, // for example, startFill(YELLOW)
/(^|\s)setWidth\(\s*[1-9][0-9]*\s*\)/, // for example, setWidth(25)
/(^|\s)endFill\(\s*\)($|\s)/, // for example, endFill()

/(^|\s)repeat\s*\(\s*[1-9][0-9]*\s*\)\s*\{[\s\}a-zA-Z]/, // for example, repeat(6) {
];


// a weak indicator of TurtleScript would be:
// /(^|\s)ht\s*\(\s*\)($|\s)/, // for example, ht()

// Looks for a few strong signs that the specified code is not CodeHeart's TurtleScript.
function isNotLikelyCodeHeartTurtleScript(code) {
	if (matchesARegex(notLikelyCodeHeartTurtleScriptRegexes, code))
		return true;
	return false;
}

function hasStrongCodeHeartTurtleScriptIndicators(code) {
	if (matchesARegex(likelyCodeHeartTurtleScriptRegexes, code))
		return true;
	return false;
}

export function isLikelyCodeHeartTurtleScript(code) {
	if (isNotLikelyCodeHeartTurtleScript(code))
		return false;
	return hasStrongCodeHeartTurtleScriptIndicators(code);
};