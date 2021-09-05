import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments as webLogoCodeNaiveStripComments } from
'../naiveStripComments.js';

const antiPovRayExpressions = [
/^\s*$/,
/\nimport\s/, // Python import statement
/\n;/, // comment in most Logo variants
/(^|\s)to\s+[a-zA-Z_][a-zA-Z_\.0-9]*\s/i, // procedure declaration as done in most Logo variants
/\srepeat\s+/i, // repeat loop as done in most Logo variants
/(^|\s)for\s*\[\s*"?[a-z_]/i,
];
const povRayRegexes = [
/(^|\s)#declare\s[a-zA-Z_0-9]+\s*=/,
/(^|\s)#define\s/,
/(^|\s)#include\s+\"/,
/(^|\s)#range\s*\(/,
/(^|\s)box\s*\{\s*\</,
/(^|\s)prism\s*\{/,
/(^|\s)#local\s+[a-zA-Z_][a-zA-Z_\d]*\s*\=/,
/(^|\s)translate<\s*-?[0-9]+/
];
['background', 'box', 'camera', 'cone', 'cylinder', 'finish', 'globel_settings',
'intersection', 'light_source', 'object', 'pigment',
'plane', 'sky_sphere', 'sphere', 'torus', 'union'].forEach(function(word) {
	povRayRegexes.push(new RegExp(`(^|\s)${word}\s*\{`));
});

function naiveStripComments(code) {
	const lines = code.split('\n');
	return lines.map(line => {
		const index = line.indexOf('//');
		if (index === -1)
			return line;
		return line.substring(0, index);
	}).join('\n').trim();
}

export function isLikelyPovRay(code) {
	const code1 = naiveStripComments(webLogoCodeNaiveStripComments(code));
	if (matchesARegex(antiPovRayExpressions, code1))
		return false;
	const code2 = naiveStripComments(code);
	if (matchesARegex(povRayRegexes, code2))
		return true;
	return false;
};