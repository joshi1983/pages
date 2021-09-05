import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../naiveStripComments.js';

const unlikelyExpressions = [
];
const likelyExpressions = [
/(^|\s)dim\s+[a-z_][a-z0-9_]*\s*\(\s*[0-9]+\s+to\s+[0-9]+\s*\)\s/i,
/(^|\n)REM\s/i,
/(^|\s)input\s+[\"”][^"”]*[\"”]\s*;[a-z]+/i,
/(^|\s)line\s+-\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)line\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)-/i,
/(^|\s)pset\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)system\s+(function|sub)\s+[a-z_]/i,
/(^|\s)declare\s+sub\s+[a-z_]/i,
/\sinkey$\s+/i,
/\s+next\s+[a-z]+%\s/i,
/,\s*&H/, // hex data value
/(^|\s)goto\s+[0-9]+\s*(\n|else|end)/i // some Logo varients use "goto" like WebLogo's jumpTo command.
	// They won't goto a single integer, though.
];

export function isLikelyQBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};