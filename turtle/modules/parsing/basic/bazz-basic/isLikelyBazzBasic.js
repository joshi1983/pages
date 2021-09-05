import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from
'../qbasic/naiveStripQBasicComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// some indications of Logo:
	/(^|[\r\n])\s*to\s+[a-z_.]/i, // Logo procedures
	/(^|[\r\n])\s*(back|backward|fd|forward|jumpForward|setPenSize)\s+\d/i,
];

const likelyExpressions = [
	/(^|[\r\n])\s*\[[ ]*(inits|main|start|start-play|title)[ ]*\]/,
	/(^|[\r\n])\s*COLOR[ \t]+[a-z]+#,[ \t]*[a-z]+#/i,
	/(^|[\r\n])\s*\[sub:[a-zA-Z_]+\]/,
		// defining a subroutine in Bazz Basic
		
	/(^|[\r\n])\s*GOSUB[ \t]+\[[ \t]*[a-z]+[ \t]*\]/i,
		// gosub is common in other BASIC dialects but following that with square brackets is
		// pretty unique to Bazz Basic
	
	/(^|[\r\n])\s*screenlock[ \t]+(on|off)(\s|$)/i,

	/[;\s](ARGCOUNT|PRG_ROOT#|TAO#)(\s|$)/
];

const likelySets = [
	[/(^|[\r\n])\s*def[ \t]+fn[ \t]+[a-z]/i, /(^|[\r\n])\s*end[ \t]+def/i]
];

export function isLikelyBazzBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	const basicCode = stripBASICCommentsAndEmptyStringLiterals(code);
	if (matchesARegex(likelyExpressions, basicCode))
		return true;
	if (matchesARegexSet(likelySets, basicCode))
		return true;
	return false;
};