import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
];

const likelyRegexes = [
	/(^|[\r\n])\s*#ifdef[ \t]+GL_ES\s*[\r\n]/,
	/(^|[\r\n])\s*(gl_FragColor|gl_Position)\s*=\s*[\w_]/,
	/(^|[\r\n])\s*(in|out|uniform|varying)[ \t]+(float|mat[234]|vec[234])\s+[a-zA-Z_][a-zA-Z_\d]*\s*;/
];

function likelyContainsMain(code) {
	return /(^|[\r\n])\s*void\s+main\s*\(\s*(void\s*)?\)\s*{/.test(code);
}

export function isLikelyGLSL(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (!likelyContainsMain(code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};