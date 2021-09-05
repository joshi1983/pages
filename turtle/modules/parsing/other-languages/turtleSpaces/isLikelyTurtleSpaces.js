import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*\/\//i,
		// a common pattern for single-line comments in
		// JavaScript, c, c++, c#, Java, PHP, and many other languages.
	
	/(^|[\r\n])\s*#/i,
		// A common pattern for
		// single line comments in Python
		// preprocessor directives in c, c++, glsl...

	/(^|[\r\n])\s*(fun|func)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// common for various other languages to define functions

	/(^|[\r\n])\s*(function|sub|subroutine)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// common for languages like Basic, JavaScript

	// some indicators of WebLogo and other Logo dialects
	/(^|[\r\n])\s*localmake[ \t]*"[a-z]/i,
	/(^|[\r\n])\s*polyStart[ \t]*[\r\n]/i, // TurtleSpaces uses beginfill instead.
	/(^|[\r\n])\s*polyEnd[ \t]*([\r\n]|$)/i // TurtleSpaces uses endfill instead.
];

const likelyRegexes = [
	/(^|[\r\n])\s*cam:fixate[ \t]*\[/i,
	/(^|[\r\n])\s*cutcone[ \t]+\d+/i,
	/(^|[\r\n])\s*definecolor[ \t]+(\d+|[a-z][a-z\d]*)[ \t]+["\[]/i,
	/(^|[\r\n])\s*dropAnchor[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*foreach[ \t]+"[a-z_][a-z_\d]*[ \t]+["\[\{]/i,
	/(^|[\r\n])\s*(frag|pin|pinFrag|random(Background|Fill|Pen)(Color|Shade)|random(Fill|Pen)Opacity|snip)[ \t]*([\r\n:]|$)/i,
	/(^|[\r\n])\s*(orbit(Left|Right)|pull(in|out)|voxeloid)[ \t]+[:a-z\d]/i,
	/(^|[\r\n])\s*polyspot([ \t]+\d+){2}/i,
	/(^|[\r\n])\s*rand[fp][cs][ \t]*([\r\n:]|$)/i,
	/[\s+\*\-\(\(]repabove[ \t]+\d/i,
	/(^|[\r\n])\s*(set[fp]s|set(fill|pen)shade)[ \t]+(-?\d+)/i,
	/(^|[\r\n])\s*setMarkerWidth[ \t]+(\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*(setPenShade|setShaderAmount)[ \t]+(-?\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*setShaderType[ \t]+"[a-z]/i,
	/(^|[\r\n])\s*(settypedepth|settypesize|slide(left|right))[ \t]+\d/i,
	/(^|[\r\n])\s*spot[ \t]+(\.?\d|:?[a-z]+)/i,
	/(^|[\r\n])\s*twosided[ \t]*[\r\n]/i,
	/(^|[\r\n])\s*(dountil|dowhile|if|until|when|while)[ \t]+(afterp|andp|animatep|approximatep|velocityp)[ \t]+/i
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*(beginfill|endfill)[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*(cone|cylinder)([ \t]+\d+){2}/i,
	/(^|[\r\n])\s*(dec|inc)[ \t]+"[a-z]/i,
	/\sICOSPHEROID[ \t]+\d/i,
	/(^|[\r\n])\s*definecolor[ \t]+(\d+|[a-z][a-z\d]*)[ \t]+/i,
	/(^|\s)dropAnchor[ \t]*([\r\n]|$)/i,
	/(^|[\r\n])\s*frag\s[a-z]/i,
		// frag expects no arguments but some other commands might be called after it.
		// for example:
		//  frag rt 180

	/(^|[\r\n])\s*hatch[ \t]*\[/i,
	/(^|[\[\]\s])ico[ \t]+\d/i,
	/(^|[\r\n])\s*mark[ \t]+(\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*merge[ \t]*[\r\n]/i,
	/(^|[\r\n])\s*(newmodel|setmodel)[ \t]+"/i,
	/(^|[\r\n])\s*raise[ \t]+[:a-z\d]/i,
	/(^|[\r\n])\s*rand[fp][cs]\s/i,
	/(^|[\r\n])\s*setfc[ \t]+\d+/i,
	/(^|[\r\n])\s*setfs[ \t]+(-?\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*setMarkerWidth[ \t]+(\d+|:[a-z]+)/i,
	/(^|[\r\n])\s*setOrigin[ \t]+(\{\[|:?[a-z]+)/i,
	/(^|[\r\n])\s*setPenWidth[ \t]+(\.?\d|:?[a-z]+)/i,
	/(^|[\r\n])\s*(setpos|setposition)[ \t]*\{/i,
		// many Logo versions support setPos but the { is pretty unique to TurtleSpaces.
		// [ is common but { is not.

	/(^|[\r\n])\s*(sl|slideLeft|sr|slideRight)[ \t]+\.?\d/i,
	/(^|[\r\n])\s*(cam|snappy):[a-z]/i,
];

export function isLikelyTurtleSpaces(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) > 1)
		return true;

	return false;
};