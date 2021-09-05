import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';

const nonPJSRegexes = [
	// indicators of JavaScript 2D canvas usage
	/[a-zA-Z]+\s*.\s*getContext\(\s*["']/
];

const pJSRegexes = [
	/(^|[\r\n])\s*createCanvas\(\s*\d+\s*,\s*\d+\s*\)\s*;?\s*([\r\n]|$)/,
	/(^|[\r\n])\s*function\s+(draw|setup)\s*\(\s*\)\s*\{/,
	/(^|[\r\n])\s*angleMode\s*\(\s*DEGREES\s*\)\s*;?\s*([\r\n]|$)/,
];

export function isLikelyJavaScriptProcessing(code) {
	const webLogoStrippedCode = naiveStripComments(code);
	if (matchesARegex(nonPJSRegexes, webLogoStrippedCode))
		return false;
	if (matchesARegex(pJSRegexes, webLogoStrippedCode))
		return true;
	return false;
};