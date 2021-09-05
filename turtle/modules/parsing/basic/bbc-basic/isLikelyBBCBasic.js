import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
// some indicators of WebLogo and other Logo versions
/(^|\s)(fd|forward|setfillcolor|setpencolor|setpensize|setpenwidth)\s+(\d+|\:[a-z_][a-z_0-9]*)/i,

// indicators of Small Visual Basic
/(\s|^)(GraphicsWindow|Turtle)\s*\.\s*[a-zA-Z_]+/,
/(\s|^)End(Function|If|Sub|While)(\s|$)/,

// indicators of QBasic
/(^|\n)[ \t]*([1-9][0-9]*[ \t]+)?color[ \t]+[\d_a-z]/i,
/(^|\s)screen\s+[\d_a-z]/i,
/(^|\s)line[ \t]+input[ \t]+"/i,
/(^|\s)locate[ \t]+[1-9][0-9]*[ \t]*\,[ \t]*([a-z][a-z_]*|[1-9][0-9]*)/i,

// indicator of Tektronix 405x BASIC
/(^|\s)go[ \t]+to(\s|$)/i,
];

const likelyExpressions = [
/(\s|^)endproc(\s|$)/i,
/(\s|^)gcol[ \t]+(on\s+)?[1-9][0-9]*(\,\s*\d+)/i,
/(^|\s)mode[ \t]+\d/i,
/(^|\s)origin[ \t]+\d+\s*\,/i,
/(^|\s)REPEAT\s+UNTIL\s+/i,
/(^|\s)vdu[ \t]+\d/i,
];

export function isLikelyBBCBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	if (matchesARegex(likelyExpressions, stripBASICCommentsAndEmptyStringLiterals(code)))
		return true;
	return false;
};