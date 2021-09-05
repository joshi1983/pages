import { matchesARegex } from '../helpers/matchesARegex.js';

const likelyJavaScriptRegexes = [
/(^|\s)function(\s|\()/, // strong indicator of JavaScript
/(^|\n)\/\//, // a single line comment from JavaScript
/(^|\n)\s*for\s*\(var\s+[_a-zA-Z]+/, // for loops like for (var i
];

const notLikelyCodeHeartTurtleScriptRegexes = [
/(^|\s)forward/i, /(^|\s)FD\s/, /(^|\s)backward\s/i, /(^|\s)setPos\s/,

];
const likelyCodeHeartTurtleScriptRegexes = [
/(^|\s)startFill\s*\(\s*[A-Z]+\s*\)($|\s)/, // for example, startFill(YELLOW)
/(^|\s)setWidth\(\s*[1-9][0-9]*\s*\)/, // for example, setWidth(25)
/(^|\s)endFill\(\s*\)($|\s)/, // for example, endFill()
/(^|\s)ht\s*\(\s*\)($|\s)/, // for example, ht()
/(^|\s)repeat\s*\(\s*[1-9][0-9]*\s*\)\s*\{[\s\}a-zA-Z]/, // for example, repeat(6) {
];

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