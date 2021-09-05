import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [];
const likelyExpressions = [
	/(^|[\r\n])[ \t]*\d+[ \t]+CALL[ \t]+(COLOR|HCHAR|VCHAR)[ \t]*\(/i,
];

export function isLikelyTexasInstruments99_4a(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, stripBASICCommentsAndEmptyStringLiterals(code)))
		return true;
	return false;
};