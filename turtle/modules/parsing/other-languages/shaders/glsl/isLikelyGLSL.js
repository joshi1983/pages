import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
];

const likelyRegexes = [
	/(^|[\r\n])\s*(gl_FragColor|gl_Position)\s*=\s*[\w_]/,
	/(^|[\r\n])\s*(in|out|uniform|varying)[ \t]+(float|mat[234]|vec[234])\s+[a-zA-Z_][a-zA-Z_\d]*\s*;/,
	/(^|[\r\n])\s*(float|int|mat[234]|vec[234]|void)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\([ \t]*(in|out)[ \t]+(float|int|mat[234]|vec[234])[ \t]+/,
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*#version[ \t]+\d{1,3}/,
	/(^|[\r\n])\s*#ifdef[ \t]+GL_ES\s*[\r\n]/,
	/(^|[\r\n])\s*void\s+main\s*\(\s*(void\s*)?\)\s*{/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(\s*(in|out)[ \t]+/,
	/(^|[\r\n])\s*(in|out|uniform|varying)([ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]){2}\s*;/,
];

export function isLikelyGLSL(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};