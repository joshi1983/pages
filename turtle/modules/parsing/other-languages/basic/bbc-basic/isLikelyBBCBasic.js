import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// some indicators of WebLogo and other Logo versions
	/(^|\s)(fd|forward|setfillcolor|setpencolor|setpensize|setpenwidth)\s+(\d+|\:[a-z_][a-z_0-9]*)/i,

	// indicators of Micro(A) Basic
	/(^|[\r\n])[ \t]*([bfw]color)[ \t]+(\d{1,3}|[a-z]+)[ \t]*,/i,
	/(^|[\r\n])[ \t]*frect[ \t]+[\(\da-z\-]/i,
	/(^|[\r\n])[ \t]*swap[ \t]*[\r\n:]/i,
	/(^|[\r\n])[ \t]*var[ \t]+[_a-z][_a-z\d]*[ \t]*,/i,
	

	// indicators of Sinclair Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?defproc[ \t]+[_a-z][_a-z\d]*[ \t]*\(/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?ink[ \t]+([_a-z][_a-z\d]*|\d+)[ \t]*([\r\n:]|$)/i,

	// indicators of Small Visual Basic
	/(\s|^)(GraphicsWindow|Turtle)\s*\.\s*[a-zA-Z_]+/,
	/(\s|^)End(Function|If|Sub|While)(\s|$)/,

	// indicators of QBasic
	/(^|[\r\n])[ \t]*([1-9][0-9]*[ \t]+)?color[ \t]+[\d_a-z]/i,
	/(^|[\r\n])[ \t]*screen[ \t]+[\d_a-z]/i,
	/(^|[\r\n])[ \t]*line[ \t]+input[ \t]+"/i,
	/(^|[\r\n])[ \t]*locate[ \t]+[1-9][0-9]*[ \t]*\,[ \t]*([a-z][a-z_]*|[1-9][0-9]*)/i,

	// indicator of Tektronix 405x BASIC
	/(^|[\r\n])[ \t]*go[ \t]+to(\s|$)/i,
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?endproc(\s|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?ENDWHILE(\s|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?gcol[ \t]+(on\s+)?[1-9][0-9]*(\,\s*\d+)/i,
	/(^|\s)origin[ \t]+\d+\s*\,/i,
	/(^|\s)REPEAT\s+UNTIL\s+/i,
	/(^|\s)vdu[ \t]+([a-z_][a-z_\d]*[%&]?)/i,
	/(^|\s)vdu[ \t]*\d/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?@%=&/,
];

const weakLikelyExpressions = [
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?mode[ \t]+\d+[\s:]/i,
		// mode 1 can also be found in Micro(A) Basic code.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?COLOUR[ \t]+\d+[ \t]*,/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?UNTIL[ \t]+FALSE[ \t]*([\r\n]|$)/i,
];

export function isLikelyBBCBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;

	const basicTrimmedCode = stripBASICCommentsAndEmptyStringLiterals(code);
	if (matchesARegex(likelyExpressions, basicTrimmedCode))
		return true;

	if (countRegexMatches(basicTrimmedCode, weakLikelyExpressions) > 1)
		return true;

	return false;
};