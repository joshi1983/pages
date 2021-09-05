import { ArrayUtils } from
'../../../ArrayUtils.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indicators of WebLogo and some other Logo dialects
	/(^|[\r\n])[ \t]*(local)?make[ \t]+"([a-z]+|\d+)\s/i,
	/(^|[\r\n])[ \t]*(repeat|rpt)\s+\d+\s*\[/i,
];

const likelyExpressions = [
];

const likelyBASICExpressions = [
];

const likelyAtariTurboBasicXLExpressions = [
	/(^|[\r\n])[ \t]*[1-9][0-9]*[ \t]+DRAWTO[ \t]+[a-z][a-z_0-9]*[ \t]*,[ \t]*[a-z][a-z_0-9]*/i,
		// for example, 120 DRAWTO x,y

	/(^|[\r\n])[ \t]*[1-9][0-9]*[ \t]+TEXT[ \t]+\d+[ \t]*,[ \t]*\d+[ \t]*,[ \t]*"/
		// for example, 150 TEXT 4,12,"HAPPY NEW YEAR 2026!!"
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyAtariTurboBasicXLExpressions);

export function isLikelyAtariTurboBasicXL(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, trimmedCode))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(likelyAtariTurboBasicXLExpressions, basicCode))
			return true;
	}
	return false;
};