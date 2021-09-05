import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indicators of QBASIC:
	/(^|[\r\n])\s*SCREEN[ \t]+\d+([\r\n]|$)/i,
	/(^|[\r\n])\s*REDIM[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
	/(^|[\r\n])\s*COMMON[ \t]+SHARED[ \t]+[a-z_][a-z_\d]*[ \t]*([\r\n,]|$)/i,
	/(^|[\r\n])\s*ON[ \t]+ERROR[ \t]+GOTO[ \t]+[a-z_]/i,

	// indicators of QB64:
	/(^|[\r\n])\s*SCREEN[ \t]+_NEWIMAGE[ \t]*\(/i,
	/(^|[\r\n])\s*DIM[ \t]+[a-z_][a-z_\d]*[ \t]+AS[ \t]+(_BIT|_BYTE|_FLOAT|_INTEGER64|_MEM|_UNSIGNED)\s/i,
];

const likelyExpressions = [
	/(^|[\r\n])\s*!/,
	/(^|[\r\n])\s*ASK[ \t]+window[ \t]/i,
	/(^|[\r\n])\s*END[ \t]+WHEN[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*EXTERNAL[ \t]*([\r\n!]|$)/i,
	/(^|[\r\n])\s*LIBRARY "/i,
	
	/(^|[\r\n])\s*ASK[ \t]+(PIXELS|WINDOW)\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*END[ \t]+MODULE\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*EXTERNAL\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*LIBRARY "/i,
	/(^|[\r\n])\s*SET[ \t]+BACKGROUND[ \t]+COLOR[ \t]+/i,
	/(^|[\r\n])\s*SET[ \t]+COLOR[ \t]+"/i,
	/(^|[\r\n])\s*[a-z_][a-z_\d]*[ \t]+#\d/i,
];

export function isLikelyTrueBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	if (matchesARegex(likelyExpressions, stripBASICCommentsAndEmptyStringLiterals(code)))
		return true;
	return false;
};