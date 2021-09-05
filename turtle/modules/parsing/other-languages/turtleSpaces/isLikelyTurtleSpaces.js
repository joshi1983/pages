import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// some indicators of WebLogo and other Logo dialects
	/(^|[\r\n])\s*localmake[ \t]*"[a-z]/i,
];

const likelyRegexes = [
	/(^|[\r\n])\s*definecolor[ \t]+\d+[ \t]+["\[]/i,
	/(^|[\r\n])\s*(frag|pin|pinFrag|random(Background|Fill|Pen)(Color|Shade)|random(Fill|Pen)Opacity)[ \t]*([\r\n:]|$)/i,
	/(^|[\r\n])\s*setMarkerWidth[ \t]+(\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*(setPenShade|setShaderAmount)[ \t]+(-?\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*setShaderType[ \t]+"[a-z]/i,
	/(^|[\r\n])\s*(settypedepth|settypesize|slideright)[ \t]+\d/i,
	/(^|[\r\n])\s*(if|while)[ \t]+(afterp|andp|animatep|approximatep|velocityp)[ \t]+/i
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*hatch[ \t]*\[/i,
	/(^|[\r\n])\s*mark[ \t]+(\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*merge[ \t]*[\r\n]/i,
	/(^|[\r\n])\s*(newmodel|setmodel)[ \t]+"/i,
	/(^|[\r\n])\s*raise[ \t]+[:a-z\d]/i
];

export function isLikelyTurtleSpaces(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) > 1)
		return true;

	return false;
};