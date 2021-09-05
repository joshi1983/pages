import { countRegexMatches } from
'../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// some single line comment markers from other programming languages
	/(^|[\r\n])[ \t]*%/, // Pascal
	/(^|[\r\n])[ \t]*(function|procedure|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// matches a lot of Basic, JavaScript, and Pascal code

	// indicators of Haskell
	/(^|[\r\n])[ \t]*{-#[ \t]+/,
	/(^|[\r\n])[ \t]*--/, // single line comment
	
	// indicators of Java
	/(^|[\r\n])[ \t]*import[ \t]+(java.|javax.swing)/,
	/(^|[\r\n])[ \t]*public[ \t]+static[ \t]+void[ \t]+main\(/,
];

const likelyRegexes = [
	/(^|[\r\n])[ \t]*@(Deprecated|TestOn)\('/,
		// for example, @Deprecated('Use turnOn instead')
	
	/(^|[\r\n])[ \t]*[a-z_][a-z_\d]*[ \t]*\?\?=\s/i,
		// for example, b ??= value;
	
	/(^|[\r\n])[ \t]*case[ \t]*\([ \t]*int[ \t]+[a-z_][a-z_\d]*[ \t]*,[ \t]*int[ \t]+[a-z_][a-z_\d]*\)[ \t]*(:|when)\s/,
		// for example, case (int a, int b) when a > b:
		// also, case (int a, int b):

	/(^|[\r\n])[ \t]*class[ \t]+[A-Z][a-z_\d]*\s+extends\s+[A-Z][a-z_\d]*\s+with\s+[A-Z][a-z_\d]*/,

	/(^|[\r\n])[ \t]*final[ \t]+((bool|double|int|String)[ \t]+)?[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*[a-zA-Z_\d'\(]/,
		// for example, final name = 'Bob';
		// also, final String nickname = 'Bobby';

	/(^|[\r\n])[ \t]*for[ \t]+\([ \t]*final[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+in[ \t]/,
		// for example, for (final object in flybyObjects) {
	
	/(^|[\r\n])[ \t]*import[ \t]*'dart:/,
	/(^|[\r\n])[ \t]*import[ \t]*'[^.'\r\n].dart'(;|[ \t]+deferred[ \t]+as[ \t]+)/,
	/(^|[\r\n])[ \t]*import[ \t]*'package:[a-z][a-z\d]*\/[a-z][a-z\d]*.dart'[ \t]+(as|hide|show)[ \t]+[a-z][a-z\d]*;/,
	/(^|[\r\n])[ \t]*late[ \t]+(bool|double|int|String)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*;/,
	/(^|[\r\n])[ \t]*mixin[ \t]+[A-Z][a-z_\d]*[ \t]*{/,
		// for example, mixin Musical {
];
const weakLikelyRegexes = [
	/(^|[\r\n])[ \t]*class[ \t]+[a-zA-Z_][a-zA-Z_\d]*\s+extends\s+[a-zA-Z_][a-zA-Z_\d]*\s+with\s+[a-zA-Z_][a-z_\d]*/,

	/(^|[\r\n])[ \t]*@override\s*[\r\n]/,
	/(^|[\r\n])[ \t]*import[ \t]*'package:/,
	/[a-z_\d]+.dart'(;|[ \t]+(deferred[ \t]+as|hide|show)[ \t]+)/,
	/[ \t]+[a-zA-Z_][a-zA-Z_\d]*\(\)[ \t]*async\s*{/,
	/(^|[\r\n])[ \t]*final([ \t]+[a-zA-Z_][a-zA-Z_\d]*){2}/,
	/(^|[\r\n])[ \t]*for[ \t]+\([ \t]*final[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]+/
];

function hasMissingPattern(code) {
	if (/(^|[\r\n])[ \t]*if\s/.test(code)) {
		// if statements in Dart need { } brackets.
		if (code.indexOf('{') === -1 ||
		code.indexOf('}') === -1)
			return true;
	}
	if (/(^|[\r\n])[ \t]*case\s/.test(code)) {
		// If there is a case, there should be a switch.
		if (!/(^|\s)switch\s*\(/.test(code))
			return true;
	}
	return false;
}

export function isLikelyDart(code) {
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