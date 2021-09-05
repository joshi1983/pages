import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])[ \t]*--/,
		// comments in Haskell, Lua, and Ada
	
	/(^|[\r\n])[ \t]*\/\//,
		// comments in many c-like languages such as c, c++, HolyC, Java, JavaScript, PHP

	/(^|[\r\n])[ \t]*(def|fn|func)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// indicators of function definitions from some other programming languages like Python, Rust.

	// indicators of Basic
	/(^|[\r\n])[ \t]*REM\s/i, // BASIC single line comments
	/(^|[\r\n])[ \t]*sub[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// BASIC subroutine definition

	/(^|[\r\n])[ \t]*end[ \t]+(function|if|while)(\s|$)/i,
	/(^|[\r\n])[ \t]*wend[ \t]*([\r\n]|$)/i,
	
	/(^|[\r\n])[ \t]*else[ \t]+if\s/i, // MatLab would use elseif instead of including a space.
	/(^|[\r\n])[ \t]*els?if\s/i
	
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*disp[ \t]*\([ \t]*['\[]/,
		// for example, disp(['n! = ' num2str(f)])

	/(^|[\r\n])[ \t]*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\[/,
		// for example, for v = [1 5 8 17]

	/(^|[\r\n])[ \t]*for[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\d+[ \t]*:[ \t]*[a-zA-Z_\d]/,
		// for example, for i = 1:length(v)
	
	/(^|[\r\n])[ \t]*function[ \t]+\[[ \t]*[a-zA-Z_][a-zA-Z_\d]*([ \t]*,[ \t]*[a-zA-Z_][a-zA-Z_\d]*)*[ \t]*\][ \t]*=[ \t]*[a-z_]/,
		// for example, function [m,s] = stat(x)

	/(^|[\r\n])[ \t]*function[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*[a-z_]/,
		// for example, function A = areaCircle(R)
	
	/(^|[\r\n])[ \t]*(elseif|if|while)[ \t]+~?(feof|isempty|isequal|strcmp|strncmp)\(/,
		// c uses strcmp a lot but it would have a ( in its similar pattern.

	/(^|[\r\n])[ \t]*(elseif|if|while)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\~=[ \t]*[\sa-z_\d]/,
		// for example, if x ~= 0
];

const weakLikelyRegexes = [
	/(^|[\r\n])[ \t]*%/,
		// single line comments in MatLab
		// can also match code from Turing

	/\d+[ \t]*:[ \t]*length[ \t]*\(/,
		// for example, 1:5:length(y)

	/(^|[\r\n])[ \t]*disp[ \t]*\(/,
		// for example,  disp(v)
	
	/(^|[\r\n])[ \t]*elseif\s*\(/i,
	/(^|[\r\n])[ \t]*figure\s*[\r\n]/,
	/(^|[\r\n])[ \t]*if[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*==[ \t]*[a-zA-Z_\d]/,
		// for example, if r == c

	/[\s=]linspace[ \t]*\(/,
	/(^|[\r\n])[ \t]*plot[ \t]*\(/,
	/(^|[\r\n])[ \t]*[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*\d+:/,
	/(^|[\r\n])[ \t]*while[ \t]+\d+[ \t]*[\r\n]/,
		// for example, while 1
		// followed by line break and the unconditional loop
];

function hasMissingPattern(code) {
	const isEndFound = /\send(\s|$)/.test(code);
	if (/(^|[\r\n])\s*(for|if|while)[ \t]/.test(code)) {
		// for, if, and while is ended with the "end" keyword in MatLab.
		if (!isEndFound)
			return true;
	}
	return false;
}

export function isLikelyMatLab(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasMissingPattern(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};