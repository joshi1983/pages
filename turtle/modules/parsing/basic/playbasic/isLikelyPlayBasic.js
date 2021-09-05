import { ArrayUtils } from
'../../../ArrayUtils.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
];

const likelyExpressions = [
	 /(^|[\r\n])[ \t]*openscreen[ \t]+\d+[ \t]*,[ \t]*\d+[ \t]*,[ \t]*\d+[ \t]*,[ \t]*\d+/,
	/[a-zA-Z=,][ \t]*(getscreenxpos|getsurfacewidth|getsurfaceheight)[ \t]*\([ \t]*\)/i,
	/(^|[\r\n])[ \t]*SetVector2d[ \t]+/i,
	/(^|[\r\n])[ \t]*(inkmode|setfps)[ \t]+\d+/i,
	/(^|[\r\n])[ \t]*Sync[ \t]*([\r\n]|$)/i
];

// indicators that are strong enough to justify the cost of scanning the code as a BASIC dialect.
const likelyBASICExpressions = [
	/(^|[\r\n])[ \t]*SetShapeEdge[ \t]+[a-z]/i,
	/(^|[\r\n])[ \t]*positionscreen[ \t]+/i,
	/=[ \t]*(GetImageWidth|NewShape|NewFxImage)[ \t]*\(/,
	/(^|[\r\n])[ \t]*EndFunction[ \t]+[a-z_][a-z_0-9]*[#\$%]?[ \t]*([\r\n]|$)/i
];

const likelyPlayBASICExpressions = [
	/(^|[\r\n])[ \t]*CreateConvexShape[ \t]+/
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyPlayBASICExpressions);

export function isLikelyPlayBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, trimmedCode))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(likelyPlayBASICExpressions, basicCode))
			return true;
	}
	return false;
};