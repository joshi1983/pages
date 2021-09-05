import { ArrayUtils } from
'../../../ArrayUtils.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indications of WebLogo:
	/(\s|^)(back|backward|fd|forward|left|right|setpensize)\s+-?\d+\n/i,
	/(\s|^)repeat\s+\d+\s*\[\s/i,
	
	// indicators of Tektronix BASIC
	/(^|[\s:])set[ \t]+(deg|degree|degrees|key|rad|rads|radian|radians)(\s|$)/i,

	// indicators of some other versions of BASIC
	/(^|[\s:])(gcol|ink|mode|paper|vdu)[ \t]*\d+([\s:]|$)/i,
	/(^|[\s:])endproc([\s:]|$)/i,

	// some indications of QBASIC
	// This does not match screen 1 and screen 0 because those are supported by Commodore BASIC.
	/(^|[\s:])screen[ \t]+(1\d+|2-9)/i,

	// indicators of Sinclair BASIC
	/(^|[\s:])[ \t]*(\d+[ \t]+)?DEF[ \t]+FN[ \t]+[a-z]/i,
	/(^|[\s:])(IF|[\=*+-/])[ \t]*FN[ \t]+[a-z]/i
];

const likelyBASICAndCommodoreExpressions = [
	/(^|\s)def[ \t]+fn["a-z][ \t]*\([ \t]*([a-z]+([ \t]*\,[ \t]*[a-z]+)*)?[ \t]*\)[ \t]*=[ \t]*[a-z0-9_\(]/i,
];

const likelyBASICExpressions = [
	/(^|\s)REM[\s\?\"]/i,
	/(^|\s)DIM[ \t]+[a-z]\s/i,
	/(^|[\s:])(\d+[ \t]+)?(GOSUB|GOTO)[ \t]+\d+/i,
	/(^|[\s:])(\d+[ \t]+)?INPUT[ \t]+"/i,
	/(^|[\s:])(\d+[ \t]+)?for[ \t]+[a-z_]+[ \t]*=[ \t]*-?(\d+|[a-z_]+)[ \t]+to[ \t]+/i
];

const likelyExpressions = [
];

const commodoreBasicIndicators = [
	/(^|\s)deffn["a-z]/i,
	/(^|[\s:])(\d+[ \t]+)?line[ \t]*,[ \t]*[\da-z]/i,
	/(^|[\s:])(NRM|WIPE)([\s:]|$)/i,
	// fairly unique to Commodore BASIC based on the few BASIC dialects I looked at
	/(^|[\s:])([\d]+[ \t]+)?PLOT[ \t]+[\da-z]/i,
	/(^|[\s:])hires[ \t]+\d*[ \t]*,[ \t]*\d/i,
	/(^|[\s:])(\d+\s+)?graphic\s+\d+\s*,\s*\d+\s*([\n\r\:]|$)/i
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyBASICAndCommodoreExpressions);
ArrayUtils.pushAll(commodoreBasicIndicators, likelyBASICAndCommodoreExpressions);

export function isLikelyCommodoreBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(commodoreBasicIndicators, basicCode))
			return true;
	}
	return false;
};