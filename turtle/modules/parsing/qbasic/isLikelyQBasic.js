import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../naiveStripComments.js';

const unlikelyExpressions = [
// indicators of WebLogo and many versions of Logo code
/(\s|^)(fd|forward)\s+[0-9][1-9]*\n/i,

// indicators of Small Visual Basic
/(\s|^)(GraphicsWindow|Turtle)\s*\.\s*[a-zA-Z_]+/,
/(\s|^)End(Function|If|Sub|While)(\s|$)/,
];

const likelyExpressions = [
/(^|\s)circle\s+step\s*\(/i,
/(^|\s)declare\s+(function|sub)\s+[a-z_][a-z_0-9]*[&$%!]?/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\s*\(\s*[0-9]+\s+to\s+[0-9]+\s*\)\s/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\s+as\s+[a-z]+/i,
/(^|\s)dim\s+[a-z_][a-z0-9_]*[!\$%&]?\([1-9][0-9]*\)\s+/i,
/(^|\n)[ \t\r]*DO\s+UNTIL\s+[a-zA-Z][a-zA-Z0-9]*/,
/(^|\s)end\s+(def|function|sub)\s*\n/i,

/(^|\s)for\s+[a-z_][a-z_]*\s*=\s*-?[1-9][0-9]*\s+to\s+[1-9][0-9]*\s+step\s+-?[1-9][0-9]*/i,
/(^|\s)for\s+[a-z_][a-z_]*\s*=\s*-?[1-9][0-9]*\s+to\s+[1-9][0-9]*\s*('|do|for|if|print|while)/i,
/(^|\s)GOSUB\s+[a-zA-Z_][a-zA-Z_0-9]*[!#%&]?(\s|'|$)/,
/(^|\n)REM\s/i,
/(^|\s)if\s+[a-z_][a-z_0-9]*[&!%$]\s*[=<>]\s*"[a-z]"\s*then\s+[a-z_][a-z_0-9]*[&!%$]?\s*=\s/i,
/(^|\s)input\s+[\"”][^"”]*[\"”]\s*;[a-z]+/i,
/(^|\s)INPUT\s*"[^"\n]*"[,;]\s*[a-zA-Z_]/,
/(^|\s)INPUT\s*'[^'\n]*'[,;]\s*[a-zA-Z_]/,
/(^|\s)INPUT\s+[a-zA-Z_][a-zA-Z_0-9]*\$(\s|$)/,
/(^|\s)INPUT\s*”[^”]*”\s*;\s*[a-zA-Z_][a-zA-Z_0-9]*(\s|$)/,

/(^|\s)line\s+-\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)line\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)-/i,
/(^|\s)line\s+step\s*\(/i,
/(^|\s)locate\s+[1-9][0-9]*\s*,\s+[1-9][0-9]*(\s|$)/i,
/(^|\s)loop\s+while\s+[a-z_]/i,
/(^|\n)[ \t\r]*next\s+[a-z_][a-z_0-9]*[&!%]?\n/i,
/(^|\s)on\s+[a-z_][a-z_0-9]*\s+(gosub|goto)\s+[a-z_0-9]+/i,
/(^|\s)PRINT\s+[a-zA-Z_][a-zA-Z0-9_]*\s*;\s*"[^"]*"\s*;/,
/(^|\s)PRINT\s*\n\s*(DO|END|FOR|GOSUB|GOTO|IF|PRINT|WHILE)(\s|$)/i,
// print is a common command in many other languages and variants Button
// specifying no arguments is very unique to QBasic.

/(^|\s)pset\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
/(^|\s)pset\s+step\s*\(/i,
/(^|\s)randomize\s+timer(\s|$)/i,
/(^|\s)SCREEN\s+([1-9]|1[0-3])(\s|$)/,
/(^|\s)system\s+(function|sub)\s+[a-z_]/i,
/(^|\s)while\s+inkey$\s*[=<>]/i,
/(^|\s)while\s+[a-z0-9\s\.,<>=%#$\^&*-+()!]+\swend(\s|$)/i,
/(^|\s)width\s+[1-9][0-9]*,\s*[1-9][0-9]*(\s|$)/i,
/\sinkey$\s+/i,
/,\s*&H/, // hex data value
/(^|\s)goto\s+[0-9]+\s*(\n|else|end)/i // some Logo varients use "goto" like WebLogo's jumpTo command.
	// They won't goto a single integer, though.
];

export function isLikelyQBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};