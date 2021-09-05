import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
// indicator of Python or Logo3D
/(\n|^)[ \t]*import\s+\w/,

// the start of a repeat-loop in Logo3D:
/(^|\s)rpt\s+\d+\s*\[/,

// some indicators of WebLogo and other Logo versions
/(^|\s)(fd|forward|setfillcolor|setpencolor|setpensize|setpenwidth)\s+(\d+|\:[a-z_][a-z_0-9]*)/i,
];

const likelyExpressions = [
	/([\n\r:]|^)[ \t]*([1-9][0-9]*[ \t]+)?(gr|hgr|hgr2)[ \t]*([\n\r:]|$)/i,
	/([\n\r:]|^)[ \t]*([1-9][0-9]*[ \t]+)?(hlin|hplot)[ \t]+([1-9][0-9]*|[a-z_]*)[ \t]*\,/i,
	/([\n\r]|^)\][ \t]*RUN[ \t]*$/,
];

const weakIndicators = [
	/(^|[\s:])GR\s*[\r\n:]/i,
	/(^|[\s:])HLIN\s[a-z0-9]/i,
	/(^|[\s:])VLIN\s[a-z0-9]/i,
	/(^|[\s:])COLOR\s*=\s*[a-z0-9]/i
];

export function isLikelyAppleSoftBasic(code) {
	const trimmedCode = naiveStripQBasicComments(naiveStripComments(code));
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;

	if (matchesARegex(likelyExpressions, stripBASICCommentsAndEmptyStringLiterals(code)))
		return true;

	if (countRegexMatches(trimmedCode, weakIndicators) >= 2) {
		return true;
	}
	return false;
};