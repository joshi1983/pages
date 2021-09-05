import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*(fn|func)[ \t]+[a-zA-Z_][a-zA-Z_\d]*[ \t]*\(/i,
	/(^|[\r\n])\s*(function|sub)[ \t]+[a-z_][a-z_\d]*[ \t]*\(/i,

	// some indicators of Dart
	/(^|[\r\n])[ \t]*class[ \t]+[A-Z][a-z_\d]*\s+extends\s+[A-Z][a-z_\d]*\s+with\s+[A-Z][a-z_\d]*/,
	/(^|[\r\n])[ \t]*import[ \t]*'/,
	/(^|[\r\n])[ \t]*mixin[ \t]+[A-Z][a-z_\d]*[ \t]*{/,
];

const likelyRegexes = [
	/(^|[\r\n])\s*actionPerformed[ \t]*\([ \t]*[a-z_][a-zA-Z_\d]*[ \t]*\)\s*{/,
		// for example, actionPerformed( e ) {

	/(^|[\r\n])\s*import[ \t]+bsh.util.BshCanvas/,
	/(^|[\r\n])\s*[a-zA-Z_][a-zA-Z_\d]*[ \t]*=[ \t]*new[ \t]+BshCanvas\(/,
		// for example, canvas=new BshCanvas();
	
	/(^|[\r\n])\s*[a-z_][a-z_\d]*[ \t]*\([ \t]*[a-z_][a-z_\d]*[ \t]+[a-z_][a-z_\d]*[ \t]*\)\s*{/i,
		// for example, httpd( int port ) { 
];

export function isLikelyBeanShell(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};