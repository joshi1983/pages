import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
];

const likelyRegexes = [
	/(^|[\r\n])\s*#pragma[ \t]+(ps|vs)[ \t]+[a-zA-Z_][a-zA-Z_\d]*/,
		// for example, #pragma ps pixelShader
	
	/(^|[\r\n])\s*(float[234])\s+[a-zA-Z_][a-zA-Z_\d]*\s*:\s*[A-Z]/,
		// for example, float3 p: POSITION

	/(^|[\r\n])\s*(float[234])\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(/
		// for example, float3 f(
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*(float[234]|matrix4x4|sampler2D|SamplerState|Texture2D)\s+[a-zA-Z_][a-zA-Z_\d]*\s*:/,
	/(^|[\r\n])\s*(float[234])\s+[a-zA-Z_][a-zA-Z_\d]*\s*=/
];

export function isLikelyHLSL(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};