import { countRegexMatches } from
'../helpers/countRegexMatches.js';
import { matchesARegex } from '../helpers/matchesARegex.js';

const unlikelyPatterns = [
/(^|[\r\n])[ \t]*#/, // indicator of Python comment at start of file or line
/(^|\s|\[)setpencolor\s+/i,
/(^|\s|\[)setpensize\s+\[/i, // for example, setPenSize [10 10] as used in FMSLogo or MSWLogo
// Papert Logo supports a setpensize command but not with a list or array passed into it

// indications of WebLogo
/(^|[\r\n])[ \t]*setpensize[ \t]+\d/i,
/(^|[\r\n])[ \t]*setfillcolor\s+/i,
/(^|[\r\n])[ \t]*polystart\s+/i,
/(^|[\r\n])[ \t]*localmake[ \t]*"/i,

/(^|[\r\n])\s*repeat\s+\d+\s+[a-z]/i, // indicator of Sonic WebLogo

// indicator of c, c++, Java, or Processing
/(^|\s)void\s+[\w\W_]+\s*\(\s*\)\s*\{/,

// indicators of JavaScript Processing and JavaScript in general
/(^|[\r\n])\s*function\s+[a-zA-Z_][a-zA-Z_\d]*\s*\(\s*\)\s*\{/,
/(^|[\r\n])[ \t]*\/\//, // comments like this one.
/(^|[\r\n])[ \t]*\/\*/, /* comments like this one */

// indicators of JavaScript in general
/(^|[\r\n])\s*(const|let|var)\s+([a-zA-Z_][a-zA-Z_\d]+)\s*=\s*[a-zA-Z_\d]/,

// indicators of KTurtle
/(^|[\r\n])[ \t]*learn\s+[a-zA-Z]/,
/(^|[\r\n])[ \t]*repeat\s+\d+\s*\{/,

// indicators of FMSLogo and MSWLogo
/(^|\s)yesnobox\s+/i,
/(^|\s)messagebox\s+/i,
/(^|\s)scrollx\s+[1-9]/i,
/(^|\s)scrolly\s+[1-9]/i,

// indicators of AMOS BASIC:
/(^|[\r\n])\s*Screen[ \t]+(Display|Hide|Open)[ \t]+\d+[ \t]*([\r\n:,]|$)/,
/(^|[\r\n])\s*Add[ \t]+[a-zA-Z]+[ \t]*,[ \t]*\d+\s+/, // For example, Add T,1
/(^|[\r\n])\s*Double[ \t]+Buffer[ \t]*([\r\n:]|$)/, // For example, Double Buffer
/(^|[\r\n])\s*End[ \t]+Proc([\r\n:]|$)/, // marks end of procedure

// indicators of Basic 256
/(^|[\r\n])\s*(clg|fastgraphics)[ \t]*([\r\n]|$)/i,
/(^|[\r\n])\s*color[ \t]+rgb[ \t]*\(/i,

// indicators of BBC Basic
/(\s|^)draw\s+[1-9]/i,
/(\s|^)endproc(\s|$)/i,
/(\s|^)mode\s+[1-9]+(\s|$)/i,
/(\s|^)(vdu|origin)\s+[1-9][0-9]*\s*\,/i,

// indicators of Micro(A) BASIC
/(\s|^)func[ \t]+[a-z_]+[ \t]*\(/i,
/(\s|^)endif(\s|$)/i,

// indicators of QBasic
/(^|\s)(declare|system)\s+(function|sub)\s+[a-z]+/i,
/(^|\s)(defint|defstr)\s+[a-z_][\da-z_]*(\s*\,[a-z_][\da-z_]*)*/i,
/\,\s*\&H/,
/(^|\s)[a-z]+\$\s/i,

// indicators of Tektronix 405x BASIC
/(^|[\s:])[ \t]*(\d+[ \t]+)?GO[ \t]+TO[ \t]+\d+/i,
/(^|[\s:])[ \t]*(\d+[ \t]+)?print[ \t]+\@[\da-z]/i, // for example, 210 PRINT @32,26:2
/(^|[\s:])[ \t]*(\d+[ \t]+)?(RDRAW|RMOVE|ROTATE)[ \t]+-?\d+[ \t]*,/i,
];
const likelyPatterns = [
/(^|[\r\n\[])[ \t]*colo[u]?r[ \t]+\[\s*(\:[a-z]+|\d)/i, 
// For example colour [255 0 0] or color [0 128 255]
// or color [:r :g :b]

/(^|[\r\n\[])[ \t]*penwidth[ \t]+\d+/i,
/(^|[\r\n\[])[ \t]*do\\.until\s+/i,
// do.until is not supported by WebLogo but is by Papert Logo.
// Not many other Logo varients support do.until.

/(^|[\r\n\[])[ \t]*fw\s+(\d+|\:[a-z_]+)/i, // For example, fw 100
// fw is an alternative name for the forward command.
// fd is common in many Logo variants but fw is fairly unique to Papert Logo.
/\sglobal "[a-z_]+/i // For example, global "factors
];

const weakLikelyPatterns = [
	/(^|[\r\n\[])[ \t]*colo[u]?r[ \t]+:[a-z_]/i, 

	/(^|[\r\n\[])[ \t]*penwidth[ \t]+:[a-z_]/i,

	/(^|[\r\n\[])[ \t]*to[ \t]+count[ \t]+:[a-z_]/i,
		// count is an internal command in many versions of Logo.
		// defining a procedure named count would be fairly unique to Papert because
		// it would not be valid code in those other versions of Logo.

	/(^|[\r\n\[])[ \t]*reset[ \t]*([\r\n\]]|$)/i,
		// the reset command is used by some other Logo varients
		// reset command is supported by KTurtle, for example.
		// but not supported by WebLogo.
];

export function isLikelyPapert(code) {
	if (matchesARegex(unlikelyPatterns, code)) {
		return false;
	}
	if (matchesARegex(likelyPatterns, code))
		return true;
	
	if (countRegexMatches(code, weakLikelyPatterns) >= 2)
		return true;

	if (code.length < 500) {
		if (/(^|[\r\n])\s*reset[ \t]*([\r\n]|$)/i.test(code))
			return true;
	}

	return false;
};