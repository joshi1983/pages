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

// indicators of FMSLogo and MSWLogo
/(^|\s)yesnobox\s+/i,
/(^|\s)messagebox\s+/i,
/(^|\s)scrollx\s+[1-9]/i,
/(^|\s)scrolly\s+[1-9]/i,

// indicators of BBC Basic
/(\s|^)draw\s+[1-9]/i,
/(\s|^)endproc(\s|$)/i,
/(\s|^)mode\s+[1-9]+(\s|$)/i,

// indicators of QBasic
/(^|\s)(declare|system)\s+(function|sub)\s+[a-z]+/i,
/\,\s*\&H/,
/(^|\s)[a-z]+\$\s/i,
];
const likelyPatterns = [
/(^|\s|\[)colo[u]?r\s+[\[\:\d]/i, // For example colour [255 0 0] or color [0 128 255]
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