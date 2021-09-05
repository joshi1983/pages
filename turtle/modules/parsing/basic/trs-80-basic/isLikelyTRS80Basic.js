import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indications of WebLogo:
	/(\s|^)(back|backward|fd|forward|left|right|setpensize)\s+-?\d+\n/i,
	/(\s|^)repeat\s+\d+\s*\[\s/i,

	// some indications of QBASIC
	/(^|[\s:])screen[ \t]+[1-9][0-9]*/i,
	/(^|[\s:])line[ \t]+input[ \t]+"/i,
	
	// indicators of Tektronix BASIC
	/(^|[\s:])set[ \t]+(deg|degree|degrees|key|rad|rads|radian|radians)(\s|$)/i,
];

const likelyBASICExpressions = [
	/(^|\s)REM[\s\?\"]/i,
	/(^|\s)DIM[ \t]+[a-z]\s/i,
	/(^|\s)def(dbl|int|sng|str)[ \t][a-z]/,
	/(^|[\s:])(\d+[ \t]+)?for[ \t]+[a-z_]+[ \t]*=[ \t]*-?(\d+|[a-z_]+)[ \t]+to[ \t]+/i
];

const likelyExpressions = [
];

/*
If we're confident the code is any BASIC dialect,
the following checks should determine if it is specifically TRS-80 BASIC.

If we're not confident that the code is any BASIC dialect,
matching these expressions should not be trusted.
*/
const trs80BasicIndicators = [
	/(^|\s)(cload|csave)\s+["a-z]/i,
	// fairly unique to TRS-80 based on the few BASIC dialects I looked at

	/(^|\s)pause[ \t]+"/i,
	// pause is fairly unique among BASIC dialects to TRS-80 BASIC.
];

export function isLikelyTRS80Basic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(trs80BasicIndicators, basicCode))
			return true;
	}
	return false;
};