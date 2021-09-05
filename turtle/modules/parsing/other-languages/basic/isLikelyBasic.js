import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from '../../naiveStripComments.js';

const unlikelyExpressions = [
	// some indicators of Logo
	/(^|[\r\n])[ \t]*(fd|forward)[ \t]+\d+/i,
	/(^|[\r\n])[ \t]*(rep|rpt|repeat)[ \t]+\d+[ \t]*\[/i,
	/(^|[\r\n])[ \t]*((local)?make)[ \t]+"[a-z_]/i,
	/(^|[\r\n])[ \t]*to[ \t]+[a-z_]/i,

	// some indicators of Go
	/(^|[\r\n])[ \t]*package[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s/
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*([1-9]\d*[ \t]+)?dim[ \t]+[a-z_]/i,
	/(^|[\r\n])[ \t]*([1-9]\d*[ \t]+)?GO[ \t]*TO[ \t]+[1-9]\d*/i,
	/(^|[\r\n])[ \t]*([1-9]\d*[ \t]+)?GOSUB[ \t]*\d+/i,
	/(^|[\r\n])[ \t]*([1-9]\d*[ \t]+)?(let[ \t]+)[a-z][a-z_\d]*\$[ \t]*=[ \t]*"/i,
		// for example, X1$ = "hi"
		// or LET Y$ = "hi"
		// or 10 LET Z$="hello"
		// Having $ at the end of an identifier is fairly unique to BASIC.
		// A trailing $ indicates the type of variable is a string.
		// The " indicates the value assigned is a string.
		// This should be a pretty rare pattern to find outside of BASIC code and somewhat frequent in BASIC.
];

const likelySets = [
	[/(^|[\r\n])[ \t]*(\d+\s+)?FOR[ \t]/i, /(^|[\r\n:])[ \t]*(\d+\s+)?NEXT(\s|$)/i],
	[/(^|[\r\n])[ \t]*(\d+\s+)?IF\s/i, /\sTHEN[ \t]+\d+\s/i],
];

/*
There are various isLikely... modules and functions for checking if given code is a very specific BASIC dialect.
isLikelyBasic checks if code is any version of BASIC.  isLikelyBasic is not checking a specific dialect.
This is used to ensure that if any code is likely to be BASIC of any kind but the code is not classified by any of the specific dialects recoginzable by WebLogo,
the code can be translated as QBasic.
*/
export function isLikelyBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;
	if (matchesARegexSet(likelySets, code))
		return true;

	return false;
};