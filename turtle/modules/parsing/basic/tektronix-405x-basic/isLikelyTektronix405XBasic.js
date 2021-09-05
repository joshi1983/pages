import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';

const unlikelyExpressions = [
	// indications of WebLogo:
	/(\s|^)(fd|forward)\s+[0-9][1-9]*\n/i,
	/(\s|^)(left|right)\s+[0-9][1-9]*\n/i,

	// some indications of QBASIC
	/(^|\s)screen[ \t]+[1-9][0-9]*/i,
	/(^|\s)line[ \t]+input[ \t]+"/i,

	// indications of other BASIC dialects
	/(^|\s)goto[ \t]+[1-9][0-9]*/i,
	// Tektronix 401X BASIC go to statements don't have a space between "go" and "to".
];

const likelyExpressions = [
/(^|\s)[1-9][0-9]*[ \t]+FIND[ \t]+[a-z]/i,
/(^|\s)[1-9][0-9]*[ \t]+GO[ \t]+TO[ \t]+[1-9][0-9]*/i,
/(^|\s)(rdraw|rmov|rmove)[ \t]+[1-9][0-9]*\s*\,\s*/i,
/(^|\s)[1-9][0-9]*[ \t]+set[ \t]+(degree[s]?|key|nokey|radian[s]?|grad)/i,
// documentation at:
// https://w140.com/tekwiki/images/b/b9/Tek_4051_basicref.pdf
// says that set uses singular angle units like "degree" instead of "degrees"
// but the examples I found used plural units.
];

export function isLikelyTektronix405XBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};