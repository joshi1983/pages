import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from './naiveStripQBasicComments.js';

const appleSoftBasicExpressions = [
	/(^|[\s:])GR\s*[\r\n:]/i,
	/(^|[\s:])HLIN\s[a-z0-9]/i,
	/(^|[\s:])VLIN\s[a-z0-9]/i,
	/(^|[\s:])COLOR\s*=\s*[a-z0-9]/i
];

const unlikelyExpressions = [
// indicators of AMOS BASIC:
/(^|[\r\n])\s*Screen[ \t]+(Display|Hide|Open)[ \t]+\d+[ \t]*([\r\n:,]|$)/,

// indications of Applesoft BASIC:
/([\r\n:]|^)[ \t]*([1-9]\d*[ \t]+)?(hgr|hgr2)[ \t]*([ \t]REM.*)?([\r\n:]|$)/i,
/([\r\n:]|^)[ \t]*([1-9]\d*[ \t]+)?hplot[ \t]+[1-9a-z_]/i,

// indicators of WebLogo and many versions of Logo code
/([\r\n]|^)[ \t]*(fd|forward)\s+[0-9][1-9]*[\r\n]/i,
/([\r\n]|^)[ \t]*\;/, // start of comment
/([\r\n]|^)[ \t]*to[ \t]+[a-z]/i, // start of procedure definition 

// indicators of Sinclair Basic
/def\s+fn[ ]+[a-z_]+[%$]?\s*\(/i,

// indicators of Sonic Webturtle
/([\r\n]|^)[ \t]*repeat[ \t][1-9]\d*[ \t]*[\r\n]/i,
/([\r\n]|^)[ \t]*showturtle[ \t]*[\r\n]/i,
/([\r\n]|^)#[ \t]+[a-z]/i,

// indicators of Small Visual Basic
/([\r\n]|^)[ \t]*(GraphicsWindow|Turtle)\s*\.\s*[a-zA-Z_]+/,
/([\r\n]|^)[ \t]*End(Function|If|Sub|While)(\s|$)/,

// indicators of Tektronix 405x BASIC
/(^|[\s:])[ \t]*(\d+[ \t]+)?GO[ \t]+TO[ \t]+\d+/i, // QBASIC has goto with no space in it.
/(^|[\s:])[ \t]*(\d+[ \t]+)?print[ \t]+\@\d/i, // for example, 210 PRINT @32,26:2
/(^|[\s:])[ \t]*(\d+[ \t]+)?(RDRAW|RMOVE|ROTATE)[ \t]+-?\d+[ \t]*,/i,

// indicators of Texas Instruments 99/4A
/(^|[\r\n])[ \t]*\d+[ \t]+CALL[ \t]+(COLOR|HCHAR|VCHAR)[ \t]*\(/i,

// indicators of BBC Basic
/(\s|^)endproc[ \t]*(\n|$)/i,
/(\n|^)[ \t]*([1-9][0-9]*[ \t]+)?mode[ \t]+([1-9][0-9]*|[a-z_][a-z_0-9]*)(\s|$)/i,
/(\n|^)[ \t]*([1-9][0-9]*[ \t]+)?move[ \t]+([1-9][0-9]*|[a-z_][a-z_0-9]*)[ \t]*\,/i,
/(\s|^)vdu[ \t]+[1-9][0-9]*\s*\,/i,

// indicators of Commodore BASIC
/([\s:]|^)(\d+[ \t]+)?line(\s+-?\d|\s*,)/i
];

const likelyExpressions = [
/(^|\s)circle\s+step\s*\(/i,
/(^|\s)circle\s*\(\s*[1-9]+\s*,\s*[1-9]+\s*\),/i,
/(^|\n)[ \t]*COLOR\s*\,\s*\d+[ \t]*([\r\n']|$)/i,
/(^|[\s:])COMMON[ \t]+SHARED[ \t]+[a-z_][a-z_\d]*/i,
/(^|\s)declare\s+(function|sub)\s+[a-z_][a-z_0-9]*[&$%!]?/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\s*\(\s*[0-9]+\s+to\s+[0-9]+\s*\)\s/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\s+as\s+[a-z]+/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\([1-9][0-9]*\)\s+/i,
/(^|\s)dim\s+shared\s+[a-z_][a-z0-9_]*[!\$%&]?\([1-9][0-9]*\)\s+/i,
/(^|\n)[ \t\r]*DO\s+UNTIL\s+[a-zA-Z][a-zA-Z0-9]*/,
/(^|\s)end\s+(def|function|sub)\s*\n/i,

/(^|\s)for\s+[a-z_][a-z_0-9]*\s*=\s*(-?[1-9][0-9]*|[a-z_][a-z_0-9]*)\s+to\s+[0-9]+\s+step\s+-?[1-9][0-9]*/i,
/(^|\s)for\s+[a-z_][a-z_0-9]*\s*=\s*(-?[0-9]+|[a-z_][a-z_0-9]*)\s+to\s+[0-9]+\s*('|do|for|if|print|while)/i,
/(^|\s)GOSUB\s+[a-zA-Z_][a-zA-Z_0-9]*[!#%&]?(\s|'|$)/,
/(^|\n)REM\s/i,
/(^|\s)if\s+[a-z_][a-z_0-9]*[&!%$]\s*[=<>]\s*"[a-z]"\s*then\s+[a-z_][a-z_0-9]*[&!%$]?\s*=\s/i,
/(^|[\=>efl])\s*INKEY\$\s*([:<=\r\n]|$)/i,
/(^|\s)input\s+[\"”][^"”]*[\"”]\s*;[a-z]+/i,
/(^|\s)INPUT\s*"[^"\n]*"[,;]\s*[a-zA-Z_]/,
/(^|\s)INPUT\s*'[^'\n]*'[,;]\s*[a-zA-Z_]/,
/(^|\s)INPUT\s+[a-zA-Z_][a-zA-Z_0-9]*\$(\s|$)/,
/(^|\s)INPUT\s*”[^”]*”\s*;\s*[a-zA-Z_][a-zA-Z_0-9]*(\s|$)/,

/(^|\s)line\s+-\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)line\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)-/i,
/(^|\s)line\s+step\s*\(/i,
/(^|\s)line[ \t]+input[ \t]+"/i,
/(^|\s)locate\s+[1-9][0-9]*\s*,\s*[1-9][0-9]*(\s|$)/i,
/(^|\s)loop\s+while\s+[a-z_]/i,
/(^|\n)[ \t\r]*next\s+[a-z_][a-z_0-9]*[&!%]?\n/i,
/(^|\s)on\s+[a-z_][a-z_0-9]*\s+(gosub|goto)\s+[a-z_0-9]+/i,
/(^|\s)paint\s*\(\s*[1-9]+\s*,\s*[1-9]+\s*\),/i,
/(^|\s)PRINT\s+[a-zA-Z_][a-zA-Z0-9_]*\s*;\s*"[^"]*"\s*;/,
/(^|\s)PRINT\s*\n\s*(DO|END|FOR|GOSUB|GOTO|IF|PRINT|WHILE)(\s|$)/i,
// print is a common command in many other languages and variants but
// specifying no arguments is very unique to QBasic.

/(^|\s)pset\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)pset\s+step\s*\(/i,
/(^|\s)randomize\s+timer(\s|$)/i,
/(^|\s)SCREEN\s*([1-9]|1[0-3])(\s|$)/,
// s* because "SCREEN2" is sometimes written instead of "SCREEN 2".

/(^|\s)system\s+(function|sub)\s+[a-z_]/i,
/(^|\s)while\s+inkey$\s*[=<>]/i,
/(^|\s)while\s+[a-z0-9\s\.,<>=%#$\^&*-+()!]+\swend(\s|$)/i,
/(^|\s)width\s+[1-9][0-9]*,\s*[1-9][0-9]*(\s|$)/i,
/,\s*&H/, // hex data value
/(^|\s)goto\s+[0-9]+\s*(\n|else|end)/i // some Logo varients use "goto" like WebLogo's jumpTo command.
	// They won't goto a single integer, though.
];

function isTooLikelyAppleSoftBasic(code) {
	return countRegexMatches(code, appleSoftBasicExpressions) >= 2;
}

export function isLikelyQBasic(code) {
	const trimmedCode = naiveStripComments(code);
	const qbTrimmedCode = naiveStripQBasicComments(trimmedCode);
	if (matchesARegex(unlikelyExpressions, qbTrimmedCode))
		return false;

	if (isTooLikelyAppleSoftBasic(qbTrimmedCode))
		return false;

	if (matchesARegex(likelyExpressions, code))
		return true;

	return false;
};