import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// comment indicators for various other programming languages
	/(^|[\r\n])\s*\/\//,
	/(^|[\r\n])\s*\/\*/,
	/(^|[\r\n])\s*%/,

	// indicators for other kinds of Basic
	/(^|[\r\n])\s*Screen[ \t]+\d+/i,
	/(^|[\r\n])\s*print[ \t]+["\d]/i,
];
const likelyRegexes = [
	/(^|[\r\n])\s*[a-z_][a-z_\d]*[ \t]*=[ \t]*(InputBox|MsgBox)[ \t]*\(/i,
		// For example, Length = InputBox("Enter Length ", "Enter a Number")

	/(^|[\r\n])\s*Set[ \t]+[a-zA-Z_][a-zA-Z_]*[ \t]*=[ \t]*fso.Open/,
		// for example, Set stream = fso.OpenTextFile("D:\Try\Support.log", ForWriting, True)

	/(^|[\r\n])\s*(Private|Public)[ \t]+(Function|Sub)[ \t]+[A-Z][a-zA-Z_\d]*[ \t]*\(/,
	/(^|[\r\n])\s*MsgBox[ \t]+"/,
];

const weakLikelyRegexes = [
	/(^|[\r\n])\s*'/, // single-line comments in VBA
	/(^|[\r\n])\s*Case[ \t]+Else[ \t]+/,
	/(^|[\r\n])\s*msgbox[ \t]+"/i,
	/(^|[\r\n])\s*msgbox[ \t]*\([ \t]*"/i,
	/(^|[\r\n])\s*(private|public)[ \t]+(function|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
	/(^|[\r\n])\s*Select[ \t]+Case[ \t]+/i,
];

function containsInvalidPatternCombination(code) {
	if (/(^|[\r\n])\s*for[ \t]+[a-z_][a-z_\d]*[ \t]*=/i.test(code)) {
		// for-loops in VBA should end with next variableName.
		if (!/\snext[ \t]+[a-z_][a-z_\d]*\s*([\r\n]|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*Select[ \t]+Case[ \t]+/i.test(code)) {
		// Select statements in VBA should be ended with end select.
		if (!/\send[ \t]+select\s*([\r\n]|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*((private|public)[ \t]+)?Function[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i.test(code)) {
		// function declarations in VBA should be ended with end function.
		if (!/\send[ \t]+function\s*([\r\n]|$)/i.test(code))
			return true;
	}
	if (/(^|[\r\n])\s*((private|public)[ \t]+)?Sub[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i.test(code)) {
		// Subroutine declarations in VBA should be ended with end sub.
		if (!/\send[ \t]+sub\s*([\r\n]|$)/i.test(code))
			return true;
	}

	return false;
}

export function isLikelyVisualBasicForApplications(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (containsInvalidPatternCombination(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};