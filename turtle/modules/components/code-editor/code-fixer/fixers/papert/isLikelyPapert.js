import { matchesARegex } from '../helpers/matchesARegex.js';

const unlikelyPatterns = [
/(^|\n)#/, // indicator of Python comment at start of file or line
/(^|\s|\[)setpencolor\s+/i,
/(^|\s|\[)setpensize\s+\[/i, // for example, setPenSize [10 10] as used in FMSLogo or MSWLogo
// Papert Logo supports a setpensize command but not with a list or array passed into it

/(^|\s|\[)setfillcolor\s+/i,
/(^|\s|\[)polystart\s+/i,

/(^|\s)repeat\s+\d+\s+[a-z]/i, // indicator of Sonic WebLogo

// indicator of c, c++, Java, or Processing
/(^|\s)void\s+[\w\W_]+\s*\(\s*\)\s*\{/,

// indicators of JavaScript Processing
/(^|[\r\n])\s*function\s+(draw|setup)\s*\(\s*\)\s*\{/,

// indicators of JavaScript in general
/(^|[\r\n])\s*(const|let|var)\s+([a-zA-Z_][a-zA-Z_\d]+)\s*=\s*[a-zA-Z_\d]/,


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
/(^|\s|\[)colo[u]?r\s+\[\s*(\:[a-z]+|\d)/i, 
// For example colour [255 0 0] or color [0 128 255]
// or color [:r :g :b]

/(^|\s|\[)penwidth\s+\d+/i,
/(^|\s|\[)do\\.until\s+/i,
// do.until is not supported by WebLogo but is by Papert Logo.
// Not many other Logo varients support do.until.

/(^|\s|\[)fw\s+(\d+|\:[a-z_]+)/i, // For example, fw 100
// fw is an alternative name for the forward command.
// fd is common in many Logo variants but fw is fairly unique to Papert Logo.
/(^|\s|\[)reset(\s|\]|$)/i,
// the reset command is used by some other Logo varients
// but not supported by WebLogo.
/\sglobal "[a-z]+/i // For example, global "factors
];

export function isLikelyPapert(code) {
	if (matchesARegex(unlikelyPatterns, code)) {
		return false;
	}
	if (matchesARegex(likelyPatterns, code))
		return true;
	return false;
};