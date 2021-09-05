import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';

const unlikelyExpressions = [
// indicator of Python or Logo3D
/(\n|^)[ \t]*import\s+\w/,

// the start of a repeat-loop in Logo3D:
/(^|\s)rpt\s+\d+\s*\[/,

// some indicators of WebLogo and other Logo versions
/(^|\s)(fd|forward|setfillcolor|setpencolor|setpensize|setpenwidth)\s+(\d+|\:[a-z_][a-z_0-9]*)/i,
];

const likelyExpressions = [
/([\n\r]|^)[ \t]*([1-9][0-9]*[ \t]+)?(gr|hgr)[ \t]*([\n\r]|$)/i,
/([\n\r]|^)[ \t]*([1-9][0-9]*[ \t]+)?(hlin|hplot)[ \t]+([1-9][0-9]*|[a-z_]*)[ \t]*\,/i,
/([\n\r]|^)\][ \t]*RUN[ \t]*$/,
];

export function isLikelyAppleSoftBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};