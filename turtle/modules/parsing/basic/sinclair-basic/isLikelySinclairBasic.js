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

	// indicators of AMOS BASIC:
	/(^|[\r\n])\s*Screen[ \t]+(Display|Hide|Open)[ \t]+\d+[ \t]*([\r\n:,]|$)/, // For example, Screen Open 0,320,200,8,0

	// indicators of Tektronix BASIC
	/(^|[\s:])set[ \t]+(deg|degree|degrees|key|rad|rads|radian|radians)(\s|$)/i,

	// indicators of some other versions of BASIC
	/(^|[\s:])(gcol|mode|vdu)[ \t]*\d+([\s:]|$)/i,
	/(^|[\s:])endproc([\s:]|$)/i,

	// some indications of QBASIC and Commodore BASIC
	/(^|[\s:])screen[ \t]+\d+/i,
];
const likelyBASICAndSinclairExpressions = [
	/(^|[\s:])[ \t]*(\d+[ \t]+)?DEF[ \t]+FN[ \t]+[a-z]+/i,
	/(^|[\s:])(IF|[\=*+-/])[ \t]*FN[ \t]+[a-z]/i,
	/(^|[\s:])[ \t]*([1-9][0-9]*[ \t]*)?(border|ink|paper)[ \t]*\d+[ \t]*([\n\r:]|$)/i,
];

const likelyBASICExpressions = [
	/(^|\s)REM[\s\?\"]/i,
	/(^|\s)DIM[ \t]+[a-z]\s/i,
	/(^|[\s:])(\d+[ \t]+)?(GOSUB|GOTO|GO[ \t]+TO)[ \t]+\d+([\n\r:]|$)/i,
	/(^|[\s:])(\d+[ \t]+)?peek[ \t]+[1-9][0-9]*([\r\n:]|$)/i,
	/(^|[\s:])(\d+[ \t]+)?read[ \t]+[a-z]"/i,
	/(^|[\s:])(\d+[ \t]+)?for[ \t]+[a-z_]+[ \t]*=[ \t]*-?(\d+|[a-z_]+)[ \t]+to[ \t]+/i
];

const likelyExpressions = [
];

const sinclairBasicIndicators = [
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyBASICAndSinclairExpressions);
ArrayUtils.pushAll(sinclairBasicIndicators, likelyBASICAndSinclairExpressions);

export function isLikelySinclairBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(sinclairBasicIndicators, basicCode))
			return true;
	}
	return false;
};