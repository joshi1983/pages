import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyExpressions = [
	// indicators of Logo
	/(^|[\r\n])[ \t]*;/, // single line comment in some versions of Logo
	/(^|[\r\n])[ \t]*(fd|forward)[ \t]+\d+[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*repeat[ \t]+\d+\s*\[/i,
	/(^|[\r\n])[ \t]*to[ \t]+[a-z_][a-z_\d]*\s+/i,

		// indicators of many other versions of BASIC
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?'/, // single line comment in some other versions of Basic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(cls|endif|wend)[ \t]*([\r\n']|$)/i,
		// HTBasic uses CLEAR SCREEN instead of cls.
		// HTBasic uses END WHILE instead of wend.
		// HTBasic also uses END IF instead of endif.
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?go[ \t]+to[ \t]+[a-z\d]/i,
		// HTBasic would use goto instead of go to.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?end[ \t]+sub[ \t]*([\r\n']|$)/i,
		// HTBasic would use subend instead of end sub.
	
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?screen[ \t]+\d+/i,
		// HTBasic doesn't set screen modes in any of the examples I looked at.
];

const likelyExpressions = [
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(ASSIGN|TRANSFER)[ \t]+@[a-z]+[ \t]+to[ \t]+/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?CLEAR[ \t]+SCREEN[ \t]*([\r\n!]|$)/i,
		// most other versions of Basic use CLS.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(COMPLEX|INTEGER)[ \t]+[a-z]/i,
		// variable declaration of complex or integer types in HTBasic

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(DEG|RAD)[ \t]*([\r\n!]|$)/i,
		// sets degrees or radians as angle units in HTBasic.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?GRAPHICS[ \t]+INPUT[ \t]+IS[ \t]+[a-z]/i,

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?IPLOT[ \t]+-?\d+[ \t]*,/i,
		// for example, 40    IPLOT 10,0
  
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?PLOTTER[ \t]+IS[ \t]+CRT[ \t]*,/i,
	
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?POLYGON[ \t]+\d/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?RUNLIGHT[ \t]+(OFF|ON)[ \t]*([\r\n!]|$)/i,

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?SUBEND[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?TRACK[ \t]+CRT[ \t]+IS[ \t]+(OFF|ON)/i, 
];

const weakLikelyExpressions = [
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?!/i, // single line comment in HTBasic
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(DE)?ALLOCATE[ \t]+[a-z]/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?DISP[ \t]+"/i,
		// DISP is similar to print.
		// DISP isn't a name used by many other BASIC versions, though.

	/(^|[\r\n])[ \t]*(\d+[ \t]+)?FRAME[ \t]*([\r\n!]|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?(GCLEAR|GINIT)[ \t]*([\r\n!]|$)/i,
	/(^|[\r\n])[ \t]*(\d+[ \t]+)?SUB[ \t]+[a-z][a-z\d]*([\r\n]|$)/i,
		// many versions of BASIC declare subroutines using the sub keyword.
		// Most other versions will have ( on the same line, though.
		// HTBasic lets you declare a no-argument subroutine like:
		// 100 SUB Subroutine1
		//
];

export function isLikelyHTBasic(code) {
	if (matchesARegex(unlikelyExpressions, code))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;

	if (countRegexMatches(code, weakLikelyExpressions) > 1)
		return true;

	return false;
};