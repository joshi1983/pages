import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { matchesARegexSet } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegexSet.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { stripBASICCommentsAndEmptyStringLiterals } from
'../helpers/stripBASICCommentsAndEmptyStringLiterals.js';

const unlikelyExpressions = [
	// indicators of Logo
	/(^|[\r\n])\s*(backward|fd|forward)[ \t]+[-]?\d/i,

	// Logo does not separate parameters using commas
	// but Basic does.
	// The following regex would match something like proc1 1 2
	/(^|[\r\n])\s*[a-z][a-z_\d]*([ \t]+[-]?\d+){2}/i,
	
	// some other versions of Basic have text statements but
	// Basic Fusion does not expect a number as first argument.
	/(^|[\r\n])\s*text\s*\d/i,
	
	// some versions of Basic use an elseif keyword.
	// Basic fusion uses "else if".
	// In other words, they keyword is split up for basic fusion.
	/(^|[\r\n])\s*elseif\s*[\r\n]/i,
];

const likelyExpressions = [
	/(^|[\r\n])\s*(DRAW3DUVOBJECT|SET3DTEXTURE)[ \t]+[a-z_]/i,
	/(^|[\r\n])\s*DRAWSPRITESTRETCHED[ \t]+[a-z_\d]/i,
	/(^|[\r\n])\s*TRI[ \t]*\(\s*\d+\s*,/i
];

const weakLikelyExpressions = [
	/(^|[\r\n])\s*(deffont|defmusic|defsound|defsprite)[ \t]+\d/i,
	/(^|[\r\n])\s*fastgraphics[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*(fontcolor|fontdata|FONTSIZE)[ \t]+\d+/i,
	/(^|[\r\n])\s*(playmusic|playsound)[ \t]+\d/i,
	/(^|[\r\n])\s*(printfont)[ \t]+\d/i,
	/(^|[\r\n])\s*SETFONT[ \t]+"/i,
	/(^|[\r\n])\s*(spritedata|spriterow)[ \t]+\d/i,
	/(^|[\r\n])\s*stopmusic[ \t]*([\n\r]|[ \t]\d|$)/i,
	/(^|[\r\n])\s*sync[ \t]*([\r\n\(]|$)/i,
	/(^|[\r\n])\s*text[ \t]*\([ \t]*\d+/i
];

const likelyExpressionSets = [
	[ // for defining objects in Basic Fusion. 
	// They're similar to class definitions in other languages.
		/(^|[\r\n])\s*OBJECT[ \t]+[a-z_][a-z_\d]*\s*[\r\n]/i,
		/(^|[\r\n])\s*END[ \t]+OBJECT\s*([\r\n]|$)/i,
	]
];

export function isLikelyBasicFusion(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, trimmedCode))
		return false;

	const basicTrimmedCode = stripBASICCommentsAndEmptyStringLiterals(code, true);
	if (matchesARegex(likelyExpressions, basicTrimmedCode))
		return true;
	if (matchesARegexSet(likelyExpressionSets, basicTrimmedCode))
		return true;
	if (countRegexMatches(basicTrimmedCode, weakLikelyExpressions) >= 2)
		return true;
	return false;
};