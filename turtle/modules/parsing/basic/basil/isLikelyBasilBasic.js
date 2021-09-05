import { ArrayUtils } from
'../../../ArrayUtils.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indicators of WebLogo and some other Logo dialects
	/(^|[\r\n])[ \t]*(local)?make[ \t]+"([a-z]+|\d+)\s/i,
	/(^|[\r\n])[ \t]*(repeat|rpt)\s+\d+\s*\[/i,
	
	// indicators of True Basic
	/(^|[\r\n])[ \t]*!/i,
	/(^|[\r\n])[ \t]*EXTERNAL\s*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*LIBRARY[ \t]+"/i,
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*#CGI_NO_HEADER\s/,
	/(^|[\r\n])[ \t]*<\?basil\s/,
	/(^|[\r\n])[ \t]*DIM[ \t]+[a-z_A-Z][a-z_A-Z\d]+[@]?[ \t]+AS[ \t]+CLASS[ \t]*\(/,
	/(^|[\r\n])[ \t]*PRINTLN[ \t]+["a-zA-Z_\d]/,
	/(^|[\r\n])[ \t]*DAW_RESET[ \t]*([\r\n]|$)/,
	/(^|[\r\n])[ \t]*PRINT[ \t]+[a-z_][a-z_\d]*[@\$]?[ \t]*\[/i,
	/(^|[\r\n])[ \t]*LET[ \t]+[a-z_][a-z_\d]*[#@\$][ \t]*=[ \t]*[a-z_][a-z_\d]*[@\$]?[ \t]*\[/i,
	/(^|[\r\n])[ \t]*WEB.SET_HTML\$\(/,
	/(^|[\r\n])[ \t]*WHILE[ \t]+TRUE[ \t]+BEGIN\s/,
	/(^|[\r\n])[ \t]*BASILICA.MENU./,
];

const likelyBASICExpressions = [
	/(^|[\r\n])[ \t]*DIM[ \t]+[a-zA-Z_][a-zA-Z_\d]*/, 

	/(^|[\r\n])[ \t]*\/\/\s/, 
		// a single-line comment that is fairly typical of c-like languages but also supported by Basil Basic

	/\)\s*BEGIN\s/i, 
		// sometimes found immediately after Basil Basic function headers

	/(^|[\r\n])[ \t]*FOR[ \t]+EACH[ \t]+/, 

	/\sTHEN[ \t]+BEGIN\s/i,
		// used in some if-then statements

	/(^|[\r\n])[ \t]*if[ \t]+([a-z]+|\d+)[ \t]+then\s/i,
];

const likelyBasilBASICExpressions = [
	/[\s=,]ENV\$[ \t]*\([ \t]*"/, // reading from an environment variable
	/[\s=,]DAW_ERR\$[ \t]*\(/
];

const likelySets = [
	[/(^|[\r\n])[ \t]*IF\s/, /\sTHEN[ \t]+BEGIN\s/, /(^|[\r\n])[ \t]*END\s/],
	[/(^|[\r\n])[ \t]*FOR[ \t]+EACH[ \t]/i, /\sIN\s/i, /(^|[\r\n:])[ \t]*NEXT(\s|$)/i],
	[/(^|[\r\n])[ \t]*FUNC[ \t]+[a-z_A-Z][a-z_A-Z\d]*[%\$#@]?[ \t]*\(/, /(^|[\r\n])[ \t]*END[ \t]+FUNC(\s|$)/],
	[/(^|[\r\n])[ \t]*FUNC[ \t]+[a-z_A-Z][a-z_A-Z\d]*[%\$#@]?[ \t]*\(/, /\)\s*BEGIN\s/, /(^|[\r\n])[ \t]*END(\s|$)/],
	[/(^|[\r\n])[ \t]*TRY\s/, /[\r\n][ \t]*CATCH[ \t]+[a-zA-Z_][a-zA-Z_\d]+\$?\s/, /[\r\n][ \t]*END[ \t]+TRY(\s|$)/]
];

ArrayUtils.pushAll(likelyBASICExpressions, likelyBasilBASICExpressions);

export function isLikelyBasilBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, trimmedCode))
		return true;
	if (matchesARegex(likelyBASICExpressions, code)) {
		const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
		if (matchesARegex(likelyBasilBASICExpressions, basicCode))
			return true;
		if (matchesARegexSet(likelySets, basicCode))
			return true;
	}
	return false;
};