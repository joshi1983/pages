import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyPatterns = [
	/(^|[\r\n])\s*\/\//,
		// single line comments from c, c++, HolyC, JavaScript
	/(^|[\r\n])\s*\/\*/, // multiline comments from c, c++...
	/(^|[\r\n])\s*%/, // comments from Turing

	/(^|[\r\n])\s*(fn|func)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/,
		// Patterns from Gleam, Go, Rust..

	/(^|[\r\n])\s*(function|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,
		// patterns from Basic
		// Perl uses "sub" for subroutines but it doesn't enclose formal arguments with ( brackets.

	/(^|[\r\n])\s*<\?php/,
		// strong indicator of PHP

	/(^|[\r\n])\s*(if|while)[ \t]+[a-zA-Z_\d]/,
		// if-statements and while-loops in Perl 
		// wrap the condition in ( brackets.
];
const likelyPatterns = [
	/(^|[\r\n])\s*#!\/usr\/bin\/perl/,
		// for example, #!/usr/bin/perl

	/(^|[\r\n])\s*foreach[ \t]+my[ \t]+\$[a-z]+[ \t]*\(/,
		// for example, foreach my $rr ($query->answer) {
	
	/(^|[\r\n])\s*my[ \t]+\$[a-z]+[ \t]*=[ \ta-zA-Z']/,
		// for example, my $hostname = 'perl.org';
	
	/(^|[\r\n])\s*my[ \t]+@[a-z_]+[ \t]*=[ \t]*\(/,
		// for example, my @list = ('a', 'list', 'of', 'lines');
	
	/(^|[\r\n])\s*sub[ \t]+[a-z_]+\s*{/,

	/(^|[\r\n])\s*use[ \t]+(Config|Email|Net|Path|Plack)::[A-Z]/,
		// for example, use Net::DNS::Resolver;

	/(^|[\r\n])\s*use[ \t]+(autodie|warnings)[ \t]*;/,
		// for example, use warnings;
];

export function isLikelyPerl(code) {
	if (matchesARegex(unlikelyPatterns, code))
		return false;

	if (matchesARegex(likelyPatterns, code))
		return true;

	return false;
};